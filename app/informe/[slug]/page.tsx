import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/integrations/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, User, Building2, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import { PublicReportClient } from "./PublicReportClient";

interface Report {
  id: string;
  report_number: string;
  customer_id: string;
  customers: {
    name: string;
    email: string;
    company: string | null;
    phone: string | null;
  };
  status: string;
  consultant_name: string;
  consultant_signature: string | null;
  sections_config: any;
  current_situation: string | null;
  findings: string | null;
  recommendations: string | null;
  conclusions: string | null;
  created_at: string;
}

interface Media {
  id: string;
  type: string;
  url: string;
  is_external: boolean;
  caption: string | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  const { data: report } = await supabase
    .from("consultation_reports")
    .select(
      `
      report_number,
      consultant_name,
      customers!fk_consultation_reports_customer (
        name,
        company
      )
    `
    )
    .eq("public_slug", slug)
    .eq("status", "sent")
    .single();

  if (!report) {
    return {
      title: "Informe no disponible | B3TA",
    };
  }

  const customerName = (report.customers as any)?.name || "Cliente";
  const company = (report.customers as any)?.company;

  return {
    title: `${report.report_number} - Informe de Consultoría | B3TA`,
    description: `Informe de consultoría para ${customerName}${company ? ` (${company})` : ""} por ${report.consultant_name}`,
    robots: { index: false, follow: false },
  };
}

export default async function PublicReportPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  const { data: report, error: reportError } = await supabase
    .from("consultation_reports")
    .select(
      `
      *,
      customers!fk_consultation_reports_customer (
        name,
        email,
        company,
        phone
      )
    `
    )
    .eq("public_slug", slug)
    .eq("status", "sent")
    .single();

  if (reportError || !report) {
    return <PublicReportClient report={null} media={[]} />;
  }

  const { data: mediaData } = await supabase
    .from("report_media")
    .select("*")
    .eq("report_id", report.id);

  const media: Media[] = mediaData || [];

  return <PublicReportClient report={report as any} media={media} />;
}
