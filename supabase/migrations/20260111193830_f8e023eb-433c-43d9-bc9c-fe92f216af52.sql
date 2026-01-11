-- Create service_inquiries table for DFY lead capture
CREATE TABLE public.service_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  selected_package TEXT NOT NULL,
  budget TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit an inquiry
CREATE POLICY "Anyone can submit service inquiries"
ON public.service_inquiries
FOR INSERT
WITH CHECK (true);

-- Only admins can view inquiries
CREATE POLICY "Admins can view all service inquiries"
ON public.service_inquiries
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update inquiries
CREATE POLICY "Admins can update service inquiries"
ON public.service_inquiries
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete inquiries
CREATE POLICY "Admins can delete service inquiries"
ON public.service_inquiries
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_service_inquiries_updated_at
BEFORE UPDATE ON public.service_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();