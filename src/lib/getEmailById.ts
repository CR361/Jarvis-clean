import { createServerSupabaseClient } from "@/lib/supabase";
import { emails } from "@/lib/types";

/**
 * Haalt een enkele e-mail op aan de hand van een ID.
 * @param id - Het ID van de e-mail
 * @returns Een e-mailobject of null bij fout of als het niet bestaat
 */
export async function getEmailById(id: string): Promise<emails | null> {
  const supabase = createServerSupabaseClient();

  // Haal alle e-mails op
  const { data: emailData, error: emailError } = await supabase
    .from("emails")
    .select("*");

  if (emailError || !emailData) {
    console.error("Fout bij ophalen van e-mails:", emailError);
    return null;
  }

  // Zoek de juiste e-mail op basis van het opgegeven ID
  const email = emailData.find((item) => String(item.id) === id);
  if (!email) {
    console.warn("Geen e-mail gevonden met ID:", id);
    return null;
  }

  return {
    id: email.id,
    customer_id: email.customer_id,
    subject: email.subject,
    email_adress: email.email_adress,
    content: email.content,
    status: email.status,
    created_at: email.created_at,
    bestand_url: email.bestand_url ?? null,
    send_at: email.send_at ?? null,
  };
}
