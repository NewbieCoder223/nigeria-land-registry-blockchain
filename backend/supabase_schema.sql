-- Sovereign Ledger: Supabase Schema Refinement
-- Run this in the Supabase SQL Editor to set up the production data layer.

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    wallet_address TEXT UNIQUE NOT NULL,
    full_name TEXT,
    email TEXT UNIQUE,
    role TEXT CHECK (role IN ('LAND_OWNER', 'SURVEYOR', 'REGISTRAR', 'VERIFIER', 'GOVERNOR')),
    nin_hash TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Land Parcels Table
CREATE TABLE public.parcels (
    parcel_id BIGINT PRIMARY KEY,
    gps_coordinates TEXT,
    area NUMERIC,
    ipfs_hash TEXT,
    owner_address TEXT NOT NULL,
    status TEXT DEFAULT 'Active', -- Active, Frozen, Disputed, Initiated, SurveyorVerified, LegallyValidated
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Transfer Requests Table
CREATE TABLE public.transfers (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    parcel_id BIGINT REFERENCES public.parcels(parcel_id) ON DELETE CASCADE,
    from_address TEXT NOT NULL,
    to_address TEXT NOT NULL,
    status TEXT DEFAULT 'Initiated', -- Initiated, SurveyorVerified, LegallyValidated, Completed, Rejected
    surveyor_approved BOOLEAN DEFAULT FALSE,
    verifier_approved BOOLEAN DEFAULT FALSE,
    registrar_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Enable Realtime
-- This is the "Magic" that fixes the dead UI by pushing updates to the frontend.
ALTER PUBLICATION supabase_realtime ADD TABLE public.parcels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transfers;

-- 4. Simple RLS (Row Level Security) - Initial Open Policy for the Prototype
-- In production, we would restrict this to the server-side service role or specific authenticated users.
ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON public.parcels FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON public.transfers FOR SELECT USING (true);

-- ADVERSARIAL FIX: Implement strict RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1. Users can only read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- 2. Prevent UI-driven inserts/updates (only backend Service Key can modify)
-- Note: Supabase Service Role bypasses RLS by default, so omitting INSERT/UPDATE here locks out the frontend completely.
