"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCustomers } from "@/lib/data";
import { createClientSideSupabaseClient } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const supabase = createClientSideSupabaseClient();

interface Customer {
  id: string;
  name: string;
  email: string;
}

const templates: Record<string, { subject: string; content: string }> = {
  welcome: {
    subject: "Welkom bij ons platform!",
    content: `Beste {{naam}},

Welkom bij ons platform! We zijn blij je te mogen verwelkomen.

Met vriendelijke groet,
Team`,
  },
  invoice: {
    subject: "Factuur voor uw recente bestelling",
    content: `Beste {{naam}},

Bijgaand vindt u de factuur voor uw recente bestelling.

Met vriendelijke groet,
Facturatieafdeling`,
  },
  reminder: {
    subject: "Herinnering: Betaling nog open",
    content: `Beste {{naam}},

Wij herinneren u vriendelijk aan de betaling die nog openstaat.

Met vriendelijke groet,
Klantenservice`,
  },
  "thank-you": {
    subject: "Bedankt voor uw bestelling",
    content: `Beste {{naam}},

Hartelijk dank voor uw bestelling! We waarderen uw vertrouwen.

Met vriendelijke groet,
Team`,
  },
};

export default function NewEmailPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch((err) => console.error("Error loading customers:", err));
  }, []);

  const handleLoadTemplate = () => {
    if (!selectedTemplate) return;
    const tpl = templates[selectedTemplate];
    const cust = customers.find((c) => String(c.id) === recipient.trim());
    setSubject(tpl.subject);
    setContent(tpl.content.replace("{{naam}}", cust?.name || ""));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const uploadFile = async (): Promise<string> => {
    if (!file) return "";
    const filename = `${Date.now()}_${file.name}`;           // unieke bestandsnaam
    console.log("Uploading file to Supabase:", filename);
    const { data, error } = await supabase.storage
      .from("bestanden-emails")
      .upload(`email-attachments/${filename}`, file);
    if (error) {
      console.error("Error uploading file:", error.message);
      throw new Error(error.message);
    }
    console.log("File uploaded, path:", data.path);
    return data.path;
  };

  const handleSaveDraft = async () => {
    if (!recipient) { alert("Selecteer eerst een ontvanger."); return; }
    const cust = customers.find((c) => String(c.id) === recipient.trim());
    if (!cust) { alert("Klant niet gevonden."); return; }

    try {
      const path = await uploadFile();
      const payload = {
        customer_id: Number(recipient), subject, email_adress: cust.email,
        content, status: "concept", created_at: new Date().toISOString(),
        send_at: null, bestand_url: path,
      };
      console.log("Saving draft payload:", payload);
      const { error } = await supabase.from("emails").insert([payload]);
      if (error) throw error;
      alert("Concept opgeslagen.");
      router.push("/emails");
    } catch (err: any) {
      console.error("Draft save error:", err);
      alert(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient) { alert("Selecteer eerst een ontvanger."); return; }
    const cust = customers.find((c) => String(c.id) === recipient.trim());
    if (!cust) { alert(`Klant niet gevonden voor id ${recipient}`); return; }

    try {
      const path = await uploadFile();
            // Verkrijg publieke URL via Supabase
      let attachmentUrl = "";
      if (path) {
        const { data: publicData } = supabase.storage
          .from("bestanden-emails")
          .getPublicUrl(path);
        console.log("Public URL from Supabase:", publicData.publicUrl);
        attachmentUrl = publicData.publicUrl;
      } else {
        console.log("No attachment path, skipping attachmentUrl");
      }
      console.log("Attachment URL to send:", attachmentUrl);

      const res = await fetch("/api/email", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: cust.email, subject, content,
          from: "contact@creadifity.com", attachmentUrl: attachmentUrl || null,
        }),
      });

      if (res.status === 404) {
        alert("API-endpoint niet gevonden. Maak app/api/email/route.ts aan."); return;
      }

      const text = await res.text();
      let mailResult: any;
      try { mailResult = JSON.parse(text); }
      catch { console.error("API-return geen JSON:", text); alert("Fout bij verzenden: ongeldige serverrespons"); return; }

      if (!res.ok) { console.error("Verzendfout:", mailResult); alert(`Verzendfout: ${mailResult.error||res.status}`); return; }

      const payload = { customer_id: Number(recipient), subject, email_adress: cust.email,
        content, status: "sent", created_at: new Date().toISOString(),
        send_at: new Date().toISOString(), bestand_url: path,
      };
      console.log("Saving sent email payload:", payload);
      const { error } = await supabase.from("emails").insert([payload]);
      if (error) throw error;

      alert("E-mail verzonden.");
      router.push("/emails");
    } catch (err: any) {
      console.error("Send error:", err);
      alert("Fout bij verzenden: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Nieuwe E-mail
        </h1>
        <Link href="/emails" className="custom-button">Terug naar e-mails</Link>
      </div>
      <Card>
        <CardHeader><CardTitle>E-mail Opstellen</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Template selector */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="template">Template</Label>
              <div className="flex gap-2">
                <select id="template" value={selectedTemplate} onChange={(e)=>setSelectedTemplate(e.target.value)} className="w-full p-2 border rounded-md">
                  <option value="">Selecteer template</option>
                  {Object.entries(templates).map(([key,tpl])=><option key={key} value={key}>{tpl.subject}</option>)}
                </select>
                <button type="button" onClick={handleLoadTemplate} className="custom-button">Template Laden</button>
              </div>
            </div>

            {/* Ontvanger */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="recipient">Ontvanger *</Label>
              <select id="recipient" value={recipient} onChange={(e)=>setRecipient(e.target.value.trim())} className="w-full p-2 border rounded-md" required>
                <option value="">Selecteer ontvanger</option>
                {customers.map(c=><option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
              </select>
            </div>

            {/* Onderwerp */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="subject">Onderwerp *</Label>
              <Input id="subject" value={subject} onChange={(e)=>setSubject(e.target.value)} className="w-full" placeholder="Onderwerp van de e-mail" required />
            </div>

            {/* Inhoud */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="content">Inhoud *</Label>
              <Textarea id="content" value={content} onChange={(e)=>setContent(e.target.value)} rows={15} className="w-full" placeholder="Inhoud van de e-mail" required />
            </div>

            {/* Bijlage */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="file">Bijlage</Label>
              <input type="file" id="file" onChange={handleFileChange} className="w-full p-2 border rounded-md" />
            </div>

            {/* Acties */}
            <div className="md:col-span-2 flex justify-end gap-2">
              <Link href="/emails"><button type="button" className="custom-button">Annuleren</button></Link>
              <button type="button" onClick={handleSaveDraft} className="custom-button">Concept Opslaan</button>
              <button type="submit" className="custom-button">Verzenden</button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
