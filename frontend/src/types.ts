export interface GasAdsorption {
  gas: string | null;
  uptake: number | null;
  unit: string | null;
  temperature_k: number | null;
  pressure_bar: number | null;
}

export interface Evidence {
  property_name: string;
  source_text: string;
  page_number: number | null;
}

export interface COFMaterial {
  id: string;
  cof_name: string | null;
  linker_smiles: string | null;
  linkage_type: string | null;
  topology: string | null;
  dimension: string | null;
  bet_surface_area: number | null;
  pore_size: number | null;
  pore_size_unit: string | null;
  thermal_stability_celsius: number | null;
  chemical_stability: string | null;
  pxrd_peaks: string | null;
  pxrd_simulated_vs_experimental: string | null;
  n2_isotherm_description: string | null;
  solvent_system: string | null;
  catalyst: string | null;
  reaction_temperature_celsius: number | null;
  reaction_time_hours: number | null;
  reaction_conditions: string | null;
  gas_adsorption: GasAdsorption[];
  evidence: Evidence[];
}

export interface Paper {
  id: string;
  doi: string | null;
  title: string | null;
  filename: string;
  authors: string | null;
  date: string | null;
  status: string;
  page_count: number | null;
  summary: string | null;
  error_message?: string | null;
  cof_count: number;
  progress_pct: number;
  progress_step: string;
  cofs?: COFMaterial[];
}
