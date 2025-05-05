"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getEmailById } from "@/lib/getEmailById";
import { getCustomers } from "@/lib/data";
import { createClientSideSupabaseClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const supabase = createClientSideSupabaseClient();

interface Customer { id: string; name: string; email: string; }
interface EmailData {
  id: string;
  customer_id: number;
  subject: string;
  email_adress: string;
  content: string;
  status: "sent" | "concept";
  created_at: string;
  send_at: string | null;
  bestand_url: string;
}

export default function EditEmailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [emailData, setEmailData] = useState<EmailData | null>(null);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipient, setRecipient] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCustomers().then(setCustomers).catch(console.error);
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getEmailById(id).then((data) => {
      if (data) {
        const parsed: EmailData = {
          ...data,
          customer_id: Number(data.customer_id),
        } as any;
        setEmailData(parsed);
        setSubject(parsed.subject);
        setContent(parsed.content);
        setRecipient(String(parsed.customer_id));
      }
      setLoading(false);
    });
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const uploadFile = async (): Promise<string> => {
    if (!file) return emailData?.bestand_url || "";
    const filename = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("bestanden-emails")
      .upload(`email-attachments/${filename}`, file);
    if (error) throw error;
    return data.path;
  };

  const handleSaveDraft = async () => {
    if (!emailData) return;
    setSaving(true);
    try {
      const path = await uploadFile();
      const { data: updated, error } = await supabase
        .from("emails")
        .update({
          customer_id: Number(recipient),
          email_adress: customers.find(c => String(c.id) === recipient)?.email,
          subject,
          content,
          status: "concept",
          bestand_url: path,
        })
        .eq("id", emailData.id)
        .select()
        .single();
      if (error) throw error;
      setEmailData(prev => prev ? { ...prev, ...updated } as EmailData : prev);
      alert("Concept bijgewerkt");
      router.push(`/emails/${emailData.id}`);
    } catch (err: any) {
      console.error(err);
      alert("Fout bij opslaan: " + err.message);
    } finally { setSaving(false); }
  };

  const handleSend = async () => {
    if (!emailData || emailData.status !== "concept") return;
    setSaving(true);
    try {
      const path = await uploadFile();
      const attachmentUrl = path
        ? `https://ctanmmpyuyqmubxiwldq.supabase.co/storage/v1/object/public/bestanden-emails/${encodeURIComponent(path)}`
        : null;
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailData.email_adress,
          subject,
          content,
          from: process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL,
          attachmentUrl,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { error: updErr } = await supabase
        .from("emails")
        .update({ status: "sent", send_at: new Date().toISOString(), bestand_url: path })
        .eq("id", emailData.id);
      if (updErr) throw updErr;
      alert("E-mail verzonden");
      router.push("/emails");
    } catch (err: any) {
      console.error(err);
      alert("Fout bij verzenden: " + err.message);
    } finally { setSaving(false); }
  };

  if (loading) return <p>Laden...</p>;
  if (!emailData) return <p>E-mail niet gevonden.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Link href="/emails" className="custom-button"><ArrowLeft className="h-4 w-4"/></Link>
          Bewerken E-mail
        </h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Concept Bewerken</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="recipient">Ontvanger *</Label>
              <select
                id="recipient"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="subject">Onderwerp *</Label>
              <Input
                id="subject"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="content">Inhoud *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={10}
                className="w-full"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="file">Bijlage</Label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2">
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="custom-button"
              >
                {saving ? "Laden..." : "Concept Opslaan"}
              </button>
              <button
                onClick={handleSend}
                disabled={saving}
                className="custom-button bg-green-600 hover:bg-green-700"
              >
                {saving ? "Bezig..." : "Verzend Concept"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
