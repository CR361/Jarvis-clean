'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DashboardPage() {
  const supabase = createClientComponentClient();

  const [stats, setStats] = useState({
    customers: 0,
    invoices: 0,
    contracts: 0,
    emails: 0,
    checklistItems: 0,
    contractors: 0,
    backups: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const { data: customers } = await supabase.from('customers').select('*');
      const { data: invoices } = await supabase.from('invoices').select('*');
      const { data: contracts } = await supabase.from('creadifity contracten data').select('*');
      const { data: emails } = await supabase.from('emails').select('*');
      const { data: checklist } = await supabase.from('invoice items').select('*');
      
      setStats({
        customers: customers?.length || 0,
        invoices: invoices?.length || 0,
        contracts: contracts?.length || 0,
        emails: emails?.length || 0,
        checklistItems: checklist?.length || 0,
        contractors: 0, 
        backups: 0,     
      });
    }

    fetchData();
  }, [supabase]);

  return (
    <div className="dashboard-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        <div className="tile">
          <i className="fas fa-users"></i>
          <span>Klanten</span>
          <div className="tile-count">{stats.customers}</div>
        </div>

        <div className="tile">
          <i className="fas fa-file-invoice-dollar"></i>
          <span>Facturen</span>
          <div className="tile-count">{stats.invoices}</div>
        </div>

        <div className="tile">
          <i className="fas fa-file-signature"></i>
          <span>Contracten</span>
          <div className="tile-count">{stats.contracts}</div>
        </div>

        <div className="tile">
          <i className="fas fa-envelope"></i>
          <span>E-mails</span>
          <div className="tile-count">{stats.emails}</div>
        </div>

        <div className="tile">
          <i className="fas fa-tasks"></i>
          <span>Checklist</span>
          <div className="tile-count">{stats.checklistItems}</div>
        </div>

        <div className="tile">
          <i className="fas fa-hard-hat"></i>
          <span>Aannemers</span>
          <div className="tile-count">{stats.contractors}</div>
        </div>

      </div>
    </div>
  );
}
