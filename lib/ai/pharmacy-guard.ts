const PHARMACY_KEYWORDS = [
  'drug', 'pharm', 'medic', 'rx', 'dose', 'toxic', 'antibiotic', 'clinical',
  'receptor', 'enzyme', 'inhibit', 'agonist', 'antagonist', 'kinetic', 'metabol',
  'clearance', 'bioavail', 'plasma', 'protein binding', 'half-life', 'mechanism',
  'cholinergic', 'adrenergic', 'serotonin', 'dopamine', 'gaba', 'opioid', 'analgesic',
  'penicillin', 'cephalosporin', 'statin', 'diuretic', 'insulin', 'beta blocker',
  'ace inhibitor', 'anticoagul', 'antiviral', 'antifungal', 'chemother', 'oncol',
  'endocrin', 'cardiovasc', 'renal', 'respirat', 'cns', 'ans', 'corticoster',
  'pharmacodynamic', 'pharmacokinetic', 'p450', 'cyp', 'vd', 'auc', 'cmax', 'tmax',
  'ld50', 'ed50', 'therapeutic index', 'drug interaction', 'contraindic', 'adverse',
  'tablet', 'capsule', 'injection', 'infusion', 'inhalation', 'transdermal',
  'generic', 'brand', 'formulary', 'dispensing', 'prescription', 'otc',
];

const VALID_TOPICS = new Set([
  'cholinergic agonists', 'muscarinic antagonists', 'nicotinic agonists',
  'adrenergic agonists', 'alpha blockers', 'beta blockers',
  'anticholinesterases', 'ganglionic blockers', 'ace inhibitors', 'arbs',
  'calcium channel blockers', 'diuretics', 'cardiac glycosides', 'antiarrhythmics',
  'anticoagulants', 'antiplatelets', 'statins', 'nitrates', 'antihypertensives',
  'heart failure drugs', 'lipid-lowering agents', 'antidepressants', 'antipsychotics',
  'anxiolytics', 'sedative-hypnotics', 'anticonvulsants', 'parkinson drugs',
  'opioid analgesics', 'nsaids', 'acetaminophen', 'migraine treatments',
  'adhd medications', 'antialcohol drugs', 'penicillins', 'cephalosporins',
  'carbapenems', 'aminoglycosides', 'macrolides', 'fluoroquinolones', 'tetracyclines',
  'sulfonamides', 'vancomycin', 'linezolid', 'antituberculosis', 'antifungals',
  'antivirals', 'antimalarials', 'chemotherapy agents', 'targeted therapy',
  'immunotherapy', 'hormonal therapy', 'antiemetics in cancer', 'insulin therapy',
  'oral hypoglycemics', 'thyroid drugs', 'corticosteroids', 'sex hormones',
  'contraceptives', 'kidney function drugs', 'electrolyte disorders',
  'diuretics mechanism', 'acid-base balance', 'ppi', 'h2 blockers', 'antiemetics',
  'laxatives', 'antidiarrheals', 'ulcer treatments', 'anemia drugs', 'erythropoietin',
  'iron supplements', 'vitamin b12/folate', 'bronchodilators',
  'corticosteroids inhalation', 'antihistamines', 'cough medications', 'copd drugs',
  'asthma treatments', 'pharmacokinetics', 'pharmacodynamics', 'drug metabolism',
  'cytochrome p450', 'half-life', 'bioavailability', 'drug interactions',
  'therapeutic drug monitoring', 'antidotes', 'poisoning management', 'drug overdose',
  'toxicology principles', 'drug therapy problems', 'iv compatibility', 'drug stability',
  'clinical calculations', 'evidence-based medicine', 'drug formulary',
  'pharmacoeconomics',
]);

export function pharmacyGuard(
  topic: string,
  fullMessage?: string
): { valid: boolean; reason?: string } {
  const topicLower = topic.toLowerCase();

  if (!VALID_TOPICS.has(topicLower)) {
    if (!PHARMACY_KEYWORDS.some((kw) => topicLower.includes(kw))) {
      return { valid: false, reason: 'Topic not in pharmacy domain' };
    }
  }

  if (fullMessage && fullMessage.length > 120) {
    const lower = fullMessage.toLowerCase();
    if (!PHARMACY_KEYWORDS.some((kw) => lower.includes(kw))) {
      return { valid: false, reason: 'Content not pharmacy-related' };
    }
  }

  return { valid: true };
}
