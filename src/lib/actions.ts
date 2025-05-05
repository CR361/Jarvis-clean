"use server"

import { revalidatePath } from "next/cache"
import type { CreateChecklistItemData, UpdateChecklistItemData, CreateContractorData, CreateBackupData } from "./types"
import { createServerSupabaseClient } from "./supabase"
import { v4 as uuidv4 } from "uuid"

// Customer actions
export async function createCustomer(data: any): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("customers").insert({
      id: uuidv4(),
      name: data.name,
      contact_person: data.contactPerson,
      email: data.email,
      phone: data.phone,
      address: data.address,
      notes: data.notes || null,
      created_at: new Date().toISOString(),
    })

    if (error) throw error

    revalidatePath("/customers")
    return { success: true }
  } catch (error: any) {
    console.error("Error creating customer:", error)
    return {
      success: false,
      error: error.message || "Er is een fout opgetreden bij het aanmaken van de klant.",
    }
  }
}

export async function updateCustomer(id: string, data: any): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase
      .from("customers")
      .update({
        name: data.name,
        contact_person: data.contactPerson,
        email: data.email,
        phone: data.phone,
        address: data.address,
        notes: data.notes || null,
      })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/customers")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating customer:", error)
    return {
      success: false,
      error: error.message || "Er is een fout opgetreden bij het bijwerken van de klant.",
    }
  }
}

export async function deleteCustomer(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    // Eerst checken of deze klant niet gekoppeld is aan facturen
    const { data: invoices, error: fetchError } = await supabase.from("invoices").select("id").eq("customer_id", id)

    if (fetchError) throw fetchError

    if (invoices && invoices.length > 0) {
      return {
        success: false,
        error: "Deze klant kan niet worden verwijderd omdat er nog facturen aan gekoppeld zijn.",
      }
    }

    const { error } = await supabase.from("customers").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/customers")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting customer:", error)
    return {
      success: false,
      error: error.message || "Er is een fout opgetreden bij het verwijderen van de klant.",
    }
  }
}

// Checklist item actions
export async function createChecklistItem(
  data: CreateChecklistItemData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("checklist_items").insert({
      id: uuidv4(),
      description: data.description,
      notes: data.notes || null,
      is_completed: false,
      created_at: new Date().toISOString(),
      contractor_id: data.contractorId || null,
    })

    if (error) throw error

    revalidatePath("/checklist")
    return { success: true }
  } catch (error: any) {
    console.error("Error creating checklist item:", error)
    return {
      success: false,
      error: error.message || "Er is een fout opgetreden bij het aanmaken van het checklist item.",
    }
  }
}

export async function updateChecklistItem(
  id: string,
  data: UpdateChecklistItemData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase
      .from("checklist_items")
      .update({
        description: data.description,
        notes: data.notes || null,
        is_completed: data.isCompleted,
        contractor_id: data.contractorId,
      })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/checklist")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating checklist item:", error)
    return {
      success: false,
      error: error.message || "Er is een fout opgetreden bij het bijwerken van het checklist item.",
    }
  }
}

export async function toggleChecklistItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    // Eerst het huidige item ophalen
    const { data: item, error: fetchError } = await supabase
      .from("checklist_items")
      .select("is_completed")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    // Status omdraaien
    const { error: updateError } = await supabase
      .from("checklist_items")
      .update({ is_completed: !item.is_completed })
      .eq("id", id)

    if (updateError) throw updateError

    revalidatePath("/checklist")
    return { success: true }
  } catch (error: any) {
    console.error("Error toggling checklist item:", error)
    return {
      success: false,
      error: error.message || "Er is een fout opgetreden bij het bijwerken van het checklist item.",
    }
  }
}

export async function deleteChecklistItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("checklist_items").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/checklist")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting checklist item:", error)
    return {
      success: false,
      error: error.message || "Er is een fout opgetreden bij het verwijderen van het checklist item.",
    }
  }
}

// Contractor actions
export async function createContractor(data: CreateContractorData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("contractors").insert({
      id: uuidv4(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      specialty: data.specialty,
      notes: data.notes || null,
      created_at: new Date().toISOString(),
    })

    if (error) throw error

    revalidatePath("/contractors")
    return { success: true }
  } catch (error: any) {
    console.error("Error creating contractor:", error)
    return {
      success: false,
      error: error.message || "Er is een fout opgetreden bij het aanmaken van de aannemer.",
    }
  }
}

export async function updateContractor(
  id: string,
  data: CreateContractorData,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase
      .from("contractors")
      .update({
        name: data.name,
        email: data.email,
        phone: data.phone,
        specialty: data.specialty,
        notes: data.notes || null,
      })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/contractors")
    return { success: true }
  } catch (error: any) {
    console.error("Error updating contractor:", error)
    return {
      success: false,
      error: error.message || "Er is een fout opgetreden bij het bijwerken van de aannemer.",
    }
  }
}

export async function deleteContractor(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    // Eerst checken of deze aannemer niet gekoppeld is aan checklist items
    const { data: items, error: fetchError } = await supabase
      .from("checklist_items")
      .select("id")
      .eq("contractor_id", id)

    if (fetchError) throw fetchError

    if (items && items.length > 0) {
      return {
        success: false,
        error: "Deze aannemer kan niet worden verwijderd omdat er nog checklist items aan gekoppeld zijn.",
      }
    }

    const { error } = await supabase.from("contractors").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/contractors")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting contractor:", error)
    return {
      success: false,
      error: error.message || "Er is een fout opgetreden bij het verwijderen van de aannemer.",
    }
  }
}

// Backup actions
export async function createBackup(data: CreateBackupData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    const timestamp = new Date().toISOString().replace(/[:.]/g, "").split("T").join("_").slice(0, 15)

    const { error } = await supabase.from("backups").insert({
      id: uuidv4(),
      timestamp: timestamp,
      date: new Date().toISOString(),
      filename: data.filename || `backup_${timestamp}.zip`,
      size: Math.floor(Math.random() * 10000000) + 5000000, // Random size tussen 5-15MB
      type: data.type || "Volledig",
      created_at: new Date().toISOString(),
    })

    if (error) throw error

    revalidatePath("/backup")
    return { success: true }
  } catch (error: any) {
    console.error("Error creating backup:", error)
    return {
      success: false,
      error: error.message || "Er is een fout opgetreden bij het maken van de backup.",
    }
  }
}

export async function downloadBackup(timestamp: string): Promise<{ success: boolean; error?: string }> {
  try {
    // In een echte applicatie zou je hier de backup downloaden
    console.log(`Downloading backup ${timestamp}`)

    return { success: true }
  } catch (error: any) {
    console.error("Error downloading backup:", error)
    return {
      success: false,
      error: error.message || "Er is een fout opgetreden bij het downloaden van de backup.",
    }
  }
}

export async function deleteBackup(timestamp: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("backups").delete().eq("timestamp", timestamp)

    if (error) throw error

    revalidatePath("/backup")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting backup:", error)
    return {
      success: false,
      error: error.message || "Er is een fout opgetreden bij het verwijderen van de backup.",
    }
  }
}
