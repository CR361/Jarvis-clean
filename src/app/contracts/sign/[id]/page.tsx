"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SignaturePad from "react-signature-canvas";
import { getContractById } from "@/lib/data";
import { createClientSideSupabaseClient } from "@/lib/supabase";
import { toast, Toaster } from "react-hot-toast";

const supabase = createClientSideSupabaseClient();

export default function SignContractPage() {
  const { id } = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<any>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const sigPad = useRef<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id || typeof id !== "string") return;
      const data = await getContractById(id);
      if (!data) return router.push("/contracts");
      setContract(data);
      setLoading(false);
    }

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Vul je naam in");
      return;
    }

    if (sigPad.current.isEmpty()) {
      toast.error("Zet een handtekening");
      return;
    }

    const signatureDataUrl = sigPad.current.getTrimmedCanvas().toDataURL("image/png");

    const { error } = await supabase
      .from("creadifity contracten data")
      .update({
        signed_by: name,
        signature: signatureDataUrl,
        signed_at: new Date().toISOString(),
      })
      .eq("id", contract.id);

    if (error) {
      console.error("Fout bij opslaan handtekening:", error.message);
      toast.error("Er ging iets mis");
    } else {
      toast.success("Handtekening opgeslagen");
      router.push("/thank-you");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Contract laden...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Toaster position="top-right" />
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Contract Ondertekenen</h1>

        <div>
          <h2 className="text-xl font-semibold mb-2">Contractinhoud</h2>
          <p className="whitespace-pre-wrap text-gray-700 border rounded p-4 bg-gray-50">
            {contract.content || "Geen inhoud beschikbaar."}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jouw Naam</label>
          <input
            type="text"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Handtekening</label>
          {/* Border is added here for the SignaturePad container */}
          <div className="border-2 border-black rounded p-4 mb-4">
            <SignaturePad 
              ref={sigPad}
              canvasProps={{
                width: 500, 
                height: 200, 
                className: "p-2",
                style: {
                  border: '2px solid black', // Adding border directly to the canvas element
                }
              }} 
            />
          </div>
          <button
            className="mt-2 text-sm text-blue-600 underline"
            onClick={() => sigPad.current.clear()}
          >
            Wissen
          </button>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-200"
          >
            Ondertekenen
          </button>
          <button
            onClick={() => router.push("/contracts")}
            className="px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition duration-200"
          >
            Annuleren
          </button>
        </div>
      </div>
    </div>
  );
}
