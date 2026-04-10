-- Create RPC function to upsert vendor (handles conflict)
CREATE OR REPLACE FUNCTION public.upsert_vendor(
  p_phone TEXT,
  p_name TEXT DEFAULT NULL,
  p_business_name TEXT DEFAULT NULL,
  p_city TEXT DEFAULT 'Douala'
)
RETURNS SETOF vendors
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO public.vendors (phone, name, business_name, city, plan, commission_rate, shop_slug)
  VALUES (p_phone, COALESCE(p_name, ''), p_business_name, p_city, 'free', 3.00, NULL)
  ON CONFLICT (phone) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, vendors.name),
    business_name = COALESCE(EXCLUDED.business_name, vendors.business_name),
    city = COALESCE(EXCLUDED.city, vendors.city),
    updated_at = NOW()
  RETURNING *;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_vendor TO anon, authenticated;
