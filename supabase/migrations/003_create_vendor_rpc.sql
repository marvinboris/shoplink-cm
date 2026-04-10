-- Create RPC function to register vendor (bypasses RLS)
CREATE OR REPLACE FUNCTION public.create_vendor(
  p_phone TEXT,
  p_name TEXT,
  p_business_name TEXT DEFAULT NULL,
  p_city TEXT DEFAULT 'Douala'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.vendors (phone, name, business_name, city, plan, commission_rate, shop_slug)
  VALUES (p_phone, p_name, p_business_name, p_city, 'free', 3.00, NULL)
  ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION public.create_vendor TO anon, authenticated;
