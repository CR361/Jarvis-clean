
'use client';

import React, { useEffect, useState } from 'react';
import { getEmails as fetchEmailsFromLib } from '@/lib/data';
import { createClientSideSupabaseClient } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

const supabase = createClientSideSupabaseClient();

interface Email {
  id: string;
  subject: string;
  recipient: string;
  email: string;
  created_at: string;
  updated_at: string;
  send_at: string | null;
  status: 'sent' | 'concept';
  opened: boolean;
}

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const raw = await fetchEmailsFromLib();
        const parsed = raw.map((e: any) => ({
          ...e,
          updated_at: e.updated_at ?? e.created_at,
          send_at: e.send_at || null,
        })) as Email[];
        setEmails(parsed);
      } catch (err) {
        console.error('Error fetching emails:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze e-mail wilt verwijderen?')) return;
    try {
      const { error } = await supabase.from('emails').delete().eq('id', id);
      if (error) throw error;
      setEmails(prev => prev.filter(e => e.id !== id));
      toast.success('E-mail succesvol verwijderd');
    } catch (err: any) {
      console.error('Fout bij verwijderen e-mail:', err);
      toast.error('Kon e-mail niet verwijderen.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleString('nl-NL', {
      timeZone: 'Europe/Amsterdam',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <i className="fas fa-envelope text-primary" /> E-mails
          </h1>
          <Link href="/emails/new">
            <button className="custom-button">Nieuwe E-mail Aanmaken</button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alle E-mails</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Laden...</p>
            ) : (
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Onderwerp</th>
                    <th className="px-4 py-2 text-left">Ontvanger</th>
                    <th className="px-6 py-2 text-center">Aangemaakt op</th>
                    <th className="px-6 py-2 text-center">Laatst geüpdatet</th>
                    <th className="px-6 py-2 text-center">Verstuurd op</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-gray-500">
                        Geen e-mails gevonden
                      </td>
                    </tr>
                  ) : (
                    emails.map(email => (
                      <tr key={email.id} className="border-t">
                        <td className="px-4 py-2">{email.subject}</td>
                        <td className="px-4 py-2">{email.recipient}</td>
                        <td className="px-6 py-2 text-center">{formatDate(email.created_at)}</td>
                        <td className="px-6 py-2 text-center">{formatDate(email.updated_at)}</td>
                        <td className="px-6 py-2 text-center">
                          {email.status === 'sent' && email.send_at ? formatDate(email.send_at) : ''}
                        </td>
                        <td className="px-4 py-2">
                          {email.status === 'sent' ? 'Verzonden' : 'Concept'}
                        </td>
                        <td className="px-4 py-2 space-x-2">
                          <Link href={`/emails/${email.id}`}> 
                            <button className="custom-button">Bekijk</button>
                          </Link>
                          <button
                            onClick={() => handleDelete(email.id)}
                            className="delete-button"
                          >
                            Verwijder
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
