import type { QuestionType } from '@/types/exam';

export const ALL_TYPES: QuestionType[] = ['mcq', 'tf', 'fill', 'explain', 'case'];

export const ALL_TOPICS: string[] = [
  // ANS
  'Cholinergic agonists', 'Muscarinic antagonists', 'Nicotinic agonists',
  'Adrenergic agonists', 'Alpha blockers', 'Beta blockers',
  'Anticholinesterases', 'Ganglionic blockers',
  // CVS
  'ACE inhibitors', 'ARBs', 'Calcium channel blockers', 'Diuretics',
  'Cardiac glycosides', 'Antiarrhythmics', 'Anticoagulants', 'Antiplatelets',
  'Statins', 'Nitrates', 'Antihypertensives', 'Heart failure drugs',
  'Lipid-lowering agents',
  // CNS
  'Antidepressants', 'Antipsychotics', 'Anxiolytics', 'Sedative-hypnotics',
  'Anticonvulsants', 'Parkinson drugs', 'Opioid analgesics', 'NSAIDs',
  'Acetaminophen', 'Migraine treatments', 'ADHD medications', 'Antialcohol drugs',
  // Antibiotics
  'Penicillins', 'Cephalosporins', 'Carbapenems', 'Aminoglycosides', 'Macrolides',
  'Fluoroquinolones', 'Tetracyclines', 'Sulfonamides', 'Vancomycin', 'Linezolid',
  'Antituberculosis', 'Antifungals', 'Antivirals', 'Antimalarials',
  // Oncology
  'Chemotherapy agents', 'Targeted therapy', 'Immunotherapy',
  'Hormonal therapy', 'Antiemetics in cancer',
  // Endocrine
  'Insulin therapy', 'Oral hypoglycemics', 'Thyroid drugs',
  'Corticosteroids', 'Sex hormones', 'Contraceptives',
  // Renal
  'Kidney function drugs', 'Electrolyte disorders',
  'Diuretics mechanism', 'Acid-base balance',
  // GI
  'PPI', 'H2 blockers', 'Antiemetics', 'Laxatives',
  'Antidiarrheals', 'Ulcer treatments',
  // Hematology
  'Anemia drugs', 'Erythropoietin', 'Iron supplements', 'Vitamin B12/Folate',
  // Respiratory
  'Bronchodilators', 'Corticosteroids inhalation', 'Antihistamines',
  'Cough medications', 'COPD drugs', 'Asthma treatments',
  // PK/PD
  'Pharmacokinetics', 'Pharmacodynamics', 'Drug metabolism', 'Cytochrome P450',
  'Half-life', 'Bioavailability', 'Drug interactions', 'Therapeutic drug monitoring',
  // Toxicology
  'Antidotes', 'Poisoning management', 'Drug overdose', 'Toxicology principles',
  // Clinical Pharmacy
  'Drug therapy problems', 'IV compatibility', 'Drug stability',
  'Clinical calculations', 'Evidence-based medicine', 'Drug formulary',
  'Pharmacoeconomics',
];
