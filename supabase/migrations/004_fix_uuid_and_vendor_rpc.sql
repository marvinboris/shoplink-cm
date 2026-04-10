-- Fix uuid_generate_v4 function and create_vendor RPC
-- First create uuid_generate_v4 if it doesn't exist
CREATE OR REPLACE FUNCTION uuid_generate_v4()
RETURNS UUID
AS $$
BEGIN
  RETURN gen_random_uuid();
END;
$$ LANGUAGE plpgsql;

-- Now create the create_vendor function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.create_vendor(
  p_phone TEXT,
  p_name TEXT DEFAULT NULL,
  p_business_name TEXT DEFAULT NULL,
  p_city TEXT DEFAULT 'Douala'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.vendors (phone, name, business_name, city, plan, commission_rate, shop_slug)
  VALUES (p_phone, COALESCE(p_name, ''), p_business_name, p_city, 'free', 3.00, NULL)
  ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION public.create_vendor TO anon, authenticated;
GRANT EXECUTE ON FUNCTION uuid_generate_v4 TO anon, authenticated;
