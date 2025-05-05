"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getEmailById } from "@/lib/getEmailById";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { createClientSideSupabaseClient } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";

const supabase = createClientSideSupabaseClient();

interface EmailData {
  id: string;
  customer_id: string;
  subject: string;
  email_adress: string;
  content: string;
  status: "sent" | "concept";
  created_at: string;
  bestand_url: string;
}

export default function EmailDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [email, setEmail] = useState<EmailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchEmail = async () => {
      setLoading(true);
      const data = await getEmailById(id);
      if (data) setEmail(data as EmailData);
      setLoading(false);
    };
    fetchEmail();
  }, [id]);

  const handleSend = async () => {
    if (!email || email.status !== "concept" || !id) return;
    setSending(true);
    try {
      const attachmentUrl = email.bestand_url
        ? `https://ctanmmpyuyqmubxiwldq.supabase.co/storage/v1/object/public/bestanden-emails/${encodeURIComponent(
            email.bestand_url
          )}`
        : null;
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email.email_adress,
          subject: email.subject,
          content: email.content,
          from: process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL,
          attachmentUrl,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { error } = await supabase
        .from("emails")
        .update({ status: "sent", send_at: new Date().toISOString() })
        .eq("id", id!);
      if (error) throw error;
      alert("E-mail verzonden!");
      router.push("/emails");
    } catch (err: any) {
      console.error("Fout bij verzenden:", err);
      alert("Fout bij verzenden: " + err.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p>Laden...</p>;
  if (!email) return <p>E-mail niet gevonden.</p>;

  const bestandPaths = email.bestand_url
    ? email.bestand_url.split(",").map((p) => p.trim()).filter(Boolean)
    : [];
  const supabaseBaseUrl = "https://ctanmmpyuyqmubxiwldq.supabase.co";
  const bucket = "bestanden-emails";
  const downloadUrls = bestandPaths.map((path) => {
    const encoded = path.split("/").map(encodeURIComponent).join("/");
    return `${supabaseBaseUrl}/storage/v1/object/public/${bucket}/${encoded}`;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> E-mail Bekijken
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{email.subject}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <strong>Ontvanger:</strong> {email.email_adress}
            </div>
            <div>
              <strong>Status:</strong> {email.status === "sent" ? "Verzonden" : "Concept"}
            </div>
            <div>
              <strong>Aangemaakt op:</strong> {new Date(email.created_at).toLocaleDateString("nl-NL", {
                timeZone: "Europe/Amsterdam",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
            <div className="sm:col-span-2">
              <strong>Inhoud:</strong>
              <p>{email.content}</p>
            </div>
          </div>

          {downloadUrls.length > 0 && (
            <div className="mt-6">
              <strong>Bijlage:</strong>
              <ul className="list-disc list-inside mt-2">
                {downloadUrls.map((url, idx) => {
                  const filename = bestandPaths[idx].split("/").pop();
                  return (
                    <li key={idx}>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="custom-button">
                        Download {filename}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Link href="/emails" className="custom-button">
          Terug naar E-mails
        </Link>
        {email.status === "concept" && (
          <>
            <Link href={`/emails/${email.id}/edit`} className="custom-button bg-blue-600 hover:bg-blue-700">
              Bewerk Concept
            </Link>
            <button
              onClick={handleSend}
              disabled={sending}
              className="custom-button bg-green-600 hover:bg-green-700"
            >
              {sending ? "Bezig..." : "Verzend Concept"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
