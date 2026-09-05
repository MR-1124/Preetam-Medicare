// MediCare Connect - Realistic Hospital Dataset

// Drug Allergy & Contraindications Reference Dictionary
export const DRUG_ALLERGY_KEYWORDS = [
  {
    allergyName: 'Penicillin',
    reaction: 'Severe urticaria, angioedema, anaphylaxis',
    keywords: ['penicillin', 'amoxicillin', 'ampicillin', 'augmentin', 'piperacillin', 'amoxil', 'clavamox', 'pen']
  },
  {
    allergyName: 'NSAID',
    reaction: 'Acute gastric ulceration, bronchospasm, hypersensitivity',
    keywords: ['nsaid', 'ibuprofen', 'diclofenac', 'naproxen', 'ketorolac', 'aceclofenac', 'indomethacin', 'meloxicam', 'combiflam', 'voveran']
  },
  {
    allergyName: 'Sulfa',
    reaction: 'Stevens-Johnson syndrome, toxic epidermal necrolysis, severe rash',
    keywords: ['sulfa', 'sulfamethoxazole', 'bactrim', 'septra', 'sulfasalazine', 'trimethoprim-sulfamethoxazole']
  },
  {
    allergyName: 'Aspirin',
    reaction: 'Aspirin-exacerbated respiratory disease (AERD), severe bronchospasm',
    keywords: ['aspirin', 'acetylsalicylic', 'disprin', 'ecospirin']
  },
  {
    allergyName: 'Opioids',
    reaction: 'Severe respiratory depression, nausea, hypotension',
    keywords: ['tramadol', 'codeine', 'morphine', 'fentanyl', 'oxycodone']
  }
];

export const INITIAL_DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Preetam Sen',
    title: 'MD, DM (Cardiology), FACC',
    specialty: 'Cardiology & Internal Medicine',
    department: 'Cardiology',
    regNumber: 'MC-WB-2015-8921',
    hospital: 'MediCare Central Super Specialty Hospital',
    chamber: 'Room 304, Block B, 3rd Floor',
    visitingHours: 'Mon - Fri: 10:00 AM - 04:00 PM',
    fee: '₹800',
    experience: '12 Years',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
    email: 'dr.preetam@medicare.org',
    phone: '+91 98310-98765',
    bio: 'Senior Consultant Cardiologist and physician specializing in cardiovascular risk management, hypertension, and holistic diagnostic patient care.'
  },
  {
    id: 'doc-2',
    name: 'Dr. Sarah Jenkins',
    title: 'MBBS, MD (Pediatrics), DCH',
    specialty: 'Pediatrics & Family Health',
    department: 'Pediatrics',
    regNumber: 'MC-WB-2018-4412',
    hospital: 'MediCare Central Super Specialty Hospital',
    chamber: 'Room 208, Pediatric Pavilion, 2nd Floor',
    visitingHours: 'Mon - Sat: 09:00 AM - 02:00 PM',
    fee: '₹700',
    experience: '9 Years',
    avatar: 'https://images.unsplash.com/photo-1594824813512-58e1c6b54191?w=200&auto=format&fit=crop&q=80',
    email: 'dr.jenkins@medicare.org',
    phone: '+91 98450-12345',
    bio: 'Dedicated pediatrician focused on child development, pediatric immunology, adolescent care, and routine immunizations.'
  },
  {
    id: 'doc-3',
    name: 'Dr. Rajesh Kulkarni',
    title: 'MS (Orthopedics), MCh, FRCS',
    specialty: 'Orthopedics & Joint Replacement',
    department: 'Orthopedics',
    regNumber: 'MC-MH-2012-6105',
    hospital: 'MediCare Central Super Specialty Hospital',
    chamber: 'Room 102, Ortho Suite, 1st Floor',
    visitingHours: 'Tue, Thu, Sat: 11:00 AM - 05:00 PM',
    fee: '₹950',
    experience: '16 Years',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
    email: 'dr.kulkarni@medicare.org',
    phone: '+91 97123-55678',
    bio: 'Specialist in joint restoration, spine management, arthritis therapy, and sports injury rehabilitation.'
  },
  {
    id: 'doc-4',
    name: 'Dr. Emily Chen',
    title: 'MD (Dermatology), DVL',
    specialty: 'Dermatology & Clinical Allergies',
    department: 'Dermatology',
    regNumber: 'MC-DL-2017-3398',
    hospital: 'MediCare Central Super Specialty Hospital',
    chamber: 'Room 410, Special Clinics, 4th Floor',
    visitingHours: 'Mon, Wed, Fri: 01:00 PM - 06:00 PM',
    fee: '₹750',
    experience: '8 Years',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
    email: 'dr.chen@medicare.org',
    phone: '+91 98990-67890',
    bio: 'Clinical dermatologist handling allergic dermatoses, eczema, autoimmune skin conditions, and aesthetic medicine.'
  }
];

export const INITIAL_PATIENTS = [
  {
    id: 'pat-1',
    name: 'Ananya Roy',
    age: 28,
    gender: 'Female',
    dob: '1998-04-14',
    bloodGroup: 'B+',
    idNumber: 'MED-PAT-1044',
    phone: '+91 98312-45678',
    email: 'ananya.roy@example.com',
    emergencyContact: 'Sumit Roy (Brother) - +91 98312-99001',
    address: 'Flat 4B, Greenwood Heights, Salt Lake Sector 3, Kolkata',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    primaryDoctorId: 'doc-1',
    allergies: ['Penicillin (Skin rash, urticaria)', 'NSAIDs (Severe gastric irritation)'],
    chronicConditions: ['Mild Bronchial Asthma', 'Allergic Sinusitis'],
    vitals: {
      bp: '118/76',
      bpStatus: 'normal',
      heartRate: 74,
      heartRateUnit: 'bpm',
      spo2: 98,
      temp: '98.4',
      tempUnit: '°F',
      weight: 58,
      weightUnit: 'kg',
      height: 165,
      heightUnit: 'cm',
      bmi: '21.3',
      bmiCategory: 'Normal',
      lastUpdated: '2026-09-02'
    },
    medicalHistory: [
      {
        date: '2026-08-14',
        condition: 'Acute Bronchial Spasm & Rhinitis',
        doctorName: 'Dr. Preetam Sen',
        department: 'Cardiology & Medicine',
        notes: 'Complained of nighttime cough and exertional wheezing for 4 days. Chest auscultation revealed bilateral rhonchi. Prescribed bronchodilator inhaler and antiallergic.'
      },
      {
        date: '2026-05-10',
        condition: 'Seasonal Allergic Rhinitis Flare-up',
        doctorName: 'Dr. Emily Chen',
        department: 'Dermatology & Allergies',
        notes: 'Persistent sneezing and nasal congestion during pollen season. Advised allergen avoidance and nasal spray.'
      },
      {
        date: '2025-11-20',
        condition: 'Annual Health & Fitness Checkup',
        doctorName: 'Dr. Preetam Sen',
        department: 'General Medicine',
        notes: 'Routine blood panel, lipid profile, and 12-lead ECG conducted. All parameters within normal reference ranges.'
      }
    ],
    vitalsHistory: [
      { date: '2026-04-12', systolic: 126, diastolic: 82, heartRate: 78, glucose: 94, spo2: 97, weight: 59 },
      { date: '2026-05-10', systolic: 124, diastolic: 80, heartRate: 76, glucose: 90, spo2: 98, weight: 58.5 },
      { date: '2026-06-18', systolic: 122, diastolic: 78, heartRate: 75, glucose: 92, spo2: 98, weight: 58.2 },
      { date: '2026-07-22', systolic: 120, diastolic: 78, heartRate: 72, glucose: 89, spo2: 99, weight: 58.0 },
      { date: '2026-08-14', systolic: 122, diastolic: 80, heartRate: 76, glucose: 91, spo2: 97, weight: 58.2 },
      { date: '2026-09-02', systolic: 118, diastolic: 76, heartRate: 74, glucose: 88, spo2: 98, weight: 58.0 }
    ]
  },
  {
    id: 'pat-2',
    name: 'Rahul Sharma',
    age: 42,
    gender: 'Male',
    dob: '1984-08-22',
    bloodGroup: 'O+',
    idNumber: 'MED-PAT-2089',
    phone: '+91 98111-23456',
    email: 'rahul.sharma@example.com',
    emergencyContact: 'Pooja Sharma (Spouse) - +91 98111-77889',
    address: 'House 12-A, Cyber City Residency, Sector 45, Gurugram',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    primaryDoctorId: 'doc-1',
    allergies: ['Sulfa antibiotics', 'Shellfish'],
    chronicConditions: ['Type 2 Diabetes Mellitus (since 2021)', 'Essential Hypertension (Stage 1)'],
    vitals: {
      bp: '136/88',
      bpStatus: 'elevated',
      heartRate: 82,
      heartRateUnit: 'bpm',
      spo2: 97,
      temp: '98.6',
      tempUnit: '°F',
      weight: 84,
      weightUnit: 'kg',
      height: 178,
      heightUnit: 'cm',
      bmi: '26.5',
      bmiCategory: 'Overweight',
      lastUpdated: '2026-08-28'
    },
    medicalHistory: [
      {
        date: '2026-08-28',
        condition: 'Quarterly Diabetic & Hypertension Review',
        doctorName: 'Dr. Preetam Sen',
        department: 'Cardiology & Medicine',
        notes: 'Fasting blood glucose 128 mg/dL, HbA1c 6.9%. Blood pressure slightly elevated at 136/88. Titrated anti-hypertensive medication.'
      },
      {
        date: '2026-06-15',
        condition: 'Mild Lumbar Strain',
        doctorName: 'Dr. Rajesh Kulkarni',
        department: 'Orthopedics',
        notes: 'Lower back stiffness after long sedentary hours. Prescribed muscle relaxant and ergonomic lumbar support exercises.'
      }
    ],
    vitalsHistory: [
      { date: '2026-04-05', systolic: 148, diastolic: 96, heartRate: 88, glucose: 146, spo2: 96, weight: 86 },
      { date: '2026-05-08', systolic: 144, diastolic: 92, heartRate: 86, glucose: 138, spo2: 97, weight: 85.5 },
      { date: '2026-06-15', systolic: 140, diastolic: 90, heartRate: 84, glucose: 134, spo2: 97, weight: 85 },
      { date: '2026-07-19', systolic: 138, diastolic: 88, heartRate: 82, glucose: 130, spo2: 97, weight: 84.5 },
      { date: '2026-08-12', systolic: 136, diastolic: 88, heartRate: 82, glucose: 128, spo2: 97, weight: 84.2 },
      { date: '2026-08-28', systolic: 134, diastolic: 86, heartRate: 80, glucose: 124, spo2: 98, weight: 84.0 }
    ]
  },
  {
    id: 'pat-3',
    name: 'Sunita Menon',
    age: 65,
    gender: 'Female',
    dob: '1961-01-30',
    bloodGroup: 'A+',
    idNumber: 'MED-PAT-3120',
    phone: '+91 97401-88901',
    email: 'sunita.menon@example.com',
    emergencyContact: 'Arjun Menon (Son) - +91 97401-22334',
    address: 'Plot 88, Palm Grove, Indiranagar, Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    primaryDoctorId: 'doc-3',
    allergies: ['No known drug allergies (NKDA)'],
    chronicConditions: ['Bilateral Knee Osteoarthritis (Grade 2)', 'Post-menopausal Osteopenia'],
    vitals: {
      bp: '124/80',
      bpStatus: 'normal',
      heartRate: 68,
      heartRateUnit: 'bpm',
      spo2: 99,
      temp: '98.1',
      tempUnit: '°F',
      weight: 62,
      weightUnit: 'kg',
      height: 156,
      heightUnit: 'cm',
      bmi: '25.5',
      bmiCategory: 'Slightly High',
      lastUpdated: '2026-08-20'
    },
    medicalHistory: [
      {
        date: '2026-08-20',
        condition: 'Knee Joint Pain on Stairs',
        doctorName: 'Dr. Rajesh Kulkarni',
        department: 'Orthopedics',
        notes: 'X-ray confirmed moderate joint space narrowing. Prescribed Glucosamine, Calcium-D3 supplementation, and low-impact hydrotherapy.'
      }
    ],
    vitalsHistory: [
      { date: '2026-04-20', systolic: 130, diastolic: 84, heartRate: 72, glucose: 102, spo2: 98, weight: 63 },
      { date: '2026-06-10', systolic: 126, diastolic: 82, heartRate: 70, glucose: 98, spo2: 98, weight: 62.5 },
      { date: '2026-08-20', systolic: 124, diastolic: 80, heartRate: 68, glucose: 96, spo2: 99, weight: 62.0 }
    ]
  },
  {
    id: 'pat-4',
    name: 'Vikram Patel',
    age: 34,
    gender: 'Male',
    dob: '1992-10-18',
    bloodGroup: 'AB+',
    idNumber: 'MED-PAT-4501',
    phone: '+91 94250-77112',
    email: 'vikram.patel@example.com',
    emergencyContact: 'Kavita Patel (Spouse) - +91 94250-66778',
    address: 'A-201, Shivalik Residency, Satellite Road, Ahmedabad',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    primaryDoctorId: 'doc-1',
    allergies: ['Aspirin (Bronchospasm)'],
    chronicConditions: ['Gastroesophageal Reflux Disease (GERD)'],
    vitals: {
      bp: '120/78',
      bpStatus: 'normal',
      heartRate: 72,
      heartRateUnit: 'bpm',
      spo2: 98,
      temp: '98.6',
      tempUnit: '°F',
      weight: 76,
      weightUnit: 'kg',
      height: 174,
      heightUnit: 'cm',
      bmi: '25.1',
      bmiCategory: 'Normal',
      lastUpdated: '2026-09-01'
    },
    medicalHistory: [
      {
        date: '2026-09-01',
        condition: 'Acid Reflux & Retrosternal Burning',
        doctorName: 'Dr. Preetam Sen',
        department: 'Medicine & Cardiology',
        notes: 'Post-prandial heartburn after late dinner. ECG performed to rule out cardiac ischemia (normal). Prescribed PPI course and lifestyle modifications.'
      }
    ],
    vitalsHistory: [
      { date: '2026-05-15', systolic: 122, diastolic: 80, heartRate: 74, glucose: 94, spo2: 98, weight: 77 },
      { date: '2026-07-10', systolic: 120, diastolic: 78, heartRate: 72, glucose: 92, spo2: 98, weight: 76.5 },
      { date: '2026-09-01', systolic: 120, diastolic: 78, heartRate: 72, glucose: 90, spo2: 98, weight: 76.0 }
    ]
  }
];

export const INITIAL_PRESCRIPTIONS = [
  {
    id: 'rx-2026-001',
    rxNumber: 'RX-MCC-2026-8910',
    date: '2026-08-14',
    patientId: 'pat-1',
    patientName: 'Ananya Roy',
    patientAge: 28,
    patientGender: 'Female',
    doctorId: 'doc-1',
    doctorName: 'Dr. Preetam Sen',
    doctorTitle: 'MD, DM (Cardiology)',
    doctorReg: 'MC-WB-2015-8921',
    department: 'Cardiology & Internal Medicine',
    diagnosis: 'Acute Bronchial Spasm with Allergic Tracheobronchitis',
    symptoms: 'Nocturnal dry cough, mild wheezing, tight chest feeling',
    vitalsAtConsult: 'BP: 118/76 mmHg | HR: 74 bpm | SpO2: 98%',
    medicines: [
      {
        id: 'med-1',
        name: 'Budesonide + Formoterol Inhaler',
        strength: '200 mcg / 6 mcg',
        form: 'Inhaler / MDI',
        dosage: '1 puff',
        frequency: 'Twice daily (Morning & Night)',
        duration: '14 days',
        timing: 'After meals',
        instructions: 'Rinse mouth thoroughly with water after each inhalation to prevent oral thrush'
      },
      {
        id: 'med-2',
        name: 'Montelukast Sodium + Levocetirizine',
        strength: '10 mg + 5 mg',
        form: 'Tablet',
        dosage: '1 tablet',
        frequency: 'Once daily at bedtime',
        duration: '10 days',
        timing: 'Before sleep',
        instructions: 'May cause mild drowsiness; avoid driving or operating machinery'
      },
      {
        id: 'med-3',
        name: 'Ambroxol + Guaiphenesin Expectorant',
        strength: '100 ml syrup',
        form: 'Syrup',
        dosage: '10 ml',
        frequency: 'Three times daily',
        duration: '5 days',
        timing: 'After food',
        instructions: 'Warm water steam inhalation twice a day recommended'
      }
    ],
    generalAdvice: [
      'Avoid exposure to sudden chilled air, aerosol sprays, and dust mites.',
      'Drink 2.5 to 3 liters of warm water daily.',
      'Maintain peak flow meter log if symptoms persist.',
      'Review after 2 weeks or immediately if shortness of breath worsens.'
    ],
    nextVisitDate: '2026-08-28',
    status: 'Active'
  },
  {
    id: 'rx-2026-002',
    rxNumber: 'RX-MCC-2026-9042',
    date: '2026-08-28',
    patientId: 'pat-2',
    patientName: 'Rahul Sharma',
    patientAge: 42,
    patientGender: 'Male',
    doctorId: 'doc-1',
    doctorName: 'Dr. Preetam Sen',
    doctorTitle: 'MD, DM (Cardiology)',
    doctorReg: 'MC-WB-2015-8921',
    department: 'Cardiology & Internal Medicine',
    diagnosis: 'Type 2 Diabetes Mellitus & Primary Hypertension (Stage 1)',
    symptoms: 'Mild morning headache, occasional afternoon fatigue',
    vitalsAtConsult: 'BP: 136/88 mmHg | HR: 82 bpm | Fasting Glucose: 128 mg/dL',
    medicines: [
      {
        id: 'med-4',
        name: 'Metformin Hydrochloride (Extended Release)',
        strength: '500 mg',
        form: 'Tablet',
        dosage: '1 tablet',
        frequency: 'Twice daily',
        duration: '30 days',
        timing: 'With lunch and dinner',
        instructions: 'Swallow whole with food to avoid gastrointestinal upset'
      },
      {
        id: 'med-5',
        name: 'Telmisartan Tablets IP',
        strength: '40 mg',
        form: 'Tablet',
        dosage: '1 tablet',
        frequency: 'Once daily in morning',
        duration: '30 days',
        timing: 'Morning after breakfast',
        instructions: 'Monitor blood pressure weekly; report dizziness or orthostasis'
      },
      {
        id: 'med-6',
        name: 'Atorvastatin Calcium',
        strength: '10 mg',
        form: 'Tablet',
        dosage: '1 tablet',
        frequency: 'Once daily at night',
        duration: '30 days',
        timing: 'At bedtime',
        instructions: 'Lipid management course; report muscle tenderness or aches'
      }
    ],
    generalAdvice: [
      'Strict adherence to low-sodium (< 4g/day) and low-glycemic index diabetic diet.',
      '30 minutes brisk walking at least 5 days a week.',
      'Repeat Fasting & Post-prandial blood sugar profile in 4 weeks.',
      'Follow-up review in 1 month.'
    ],
    nextVisitDate: '2026-09-28',
    status: 'Active'
  },
  {
    id: 'rx-2026-003',
    rxNumber: 'RX-MCC-2026-7734',
    date: '2026-05-10',
    patientId: 'pat-1',
    patientName: 'Ananya Roy',
    patientAge: 28,
    patientGender: 'Female',
    doctorId: 'doc-4',
    doctorName: 'Dr. Emily Chen',
    doctorTitle: 'MD (Dermatology & Allergies)',
    doctorReg: 'MC-DL-2017-3398',
    department: 'Dermatology',
    diagnosis: 'Seasonal Allergic Rhinoconjunctivitis',
    symptoms: 'Watery itchy eyes, continuous sneezing, clear rhinorrhea',
    vitalsAtConsult: 'BP: 116/74 mmHg | HR: 72 bpm | Temp: 98.4°F',
    medicines: [
      {
        id: 'med-7',
        name: 'Olopatadine 0.1% Ophthalmic Drops',
        strength: '5 ml',
        form: 'Eye Drops',
        dosage: '1 drop in each eye',
        frequency: 'Twice daily',
        duration: '7 days',
        timing: 'Morning and evening',
        instructions: 'Do not touch dropper tip to eyelashes or cornea'
      },
      {
        id: 'med-8',
        name: 'Fluticasone Propionate Nasal Spray',
        strength: '50 mcg/actuation',
        form: 'Nasal Spray',
        dosage: '1 spray per nostril',
        frequency: 'Once daily in morning',
        duration: '14 days',
        timing: 'Morning',
        instructions: 'Blow nose gently before administering; shake bottle before use'
      }
    ],
    generalAdvice: [
      'Keep bedroom windows closed during early morning peak pollen counts.',
      'Use HEPA air filtration if available.'
    ],
    nextVisitDate: 'Completed',
    status: 'Completed'
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: 'appt-1',
    appointmentNumber: 'APT-2026-101',
    patientId: 'pat-1',
    patientName: 'Ananya Roy',
    doctorId: 'doc-1',
    doctorName: 'Dr. Preetam Sen',
    department: 'Cardiology & Medicine',
    date: '2026-09-08',
    time: '10:30 AM',
    status: 'Confirmed',
    type: 'Follow-up Consultation',
    reason: 'Asthma symptom evaluation and 2-week post-inhaler checkup',
    notes: 'Patient reported 80% improvement in nocturnal coughing'
  },
  {
    id: 'appt-2',
    appointmentNumber: 'APT-2026-102',
    patientId: 'pat-2',
    patientName: 'Rahul Sharma',
    doctorId: 'doc-1',
    doctorName: 'Dr. Preetam Sen',
    department: 'Cardiology & Medicine',
    date: '2026-09-08',
    time: '11:15 AM',
    status: 'Confirmed',
    type: 'Regular Checkup',
    reason: 'Routine BP check & diabetic fasting lab report review',
    notes: 'Bring updated fasting blood sugar diary'
  },
  {
    id: 'appt-3',
    appointmentNumber: 'APT-2026-103',
    patientId: 'pat-4',
    patientName: 'Vikram Patel',
    doctorId: 'doc-1',
    doctorName: 'Dr. Preetam Sen',
    department: 'Cardiology & Medicine',
    date: '2026-09-09',
    time: '02:00 PM',
    status: 'Confirmed',
    type: 'Specialist Consultation',
    reason: 'Persistent acid reflux and epigastric discomfort review',
    notes: 'Evaluate response to PPI therapy'
  },
  {
    id: 'appt-4',
    appointmentNumber: 'APT-2026-104',
    patientId: 'pat-3',
    patientName: 'Sunita Menon',
    doctorId: 'doc-3',
    doctorName: 'Dr. Rajesh Kulkarni',
    department: 'Orthopedics',
    date: '2026-09-10',
    time: '12:00 PM',
    status: 'Confirmed',
    type: 'Orthopedic Evaluation',
    reason: 'Right knee mobility check post physiotherapy course',
    notes: 'Review joint stiffness degree'
  },
  {
    id: 'appt-5',
    appointmentNumber: 'APT-2026-095',
    patientId: 'pat-1',
    patientName: 'Ananya Roy',
    doctorId: 'doc-1',
    doctorName: 'Dr. Preetam Sen',
    department: 'Cardiology & Medicine',
    date: '2026-08-14',
    time: '10:30 AM',
    status: 'Completed',
    type: 'Initial Consultation',
    reason: 'Sudden chest tightness and persistent night cough',
    notes: 'Prescription RX-MCC-2026-8910 issued'
  }
];

// Quick Prescription Presets for doctors to compose in 1-click
export const CLINICAL_PRESETS = [
  {
    name: 'Upper Respiratory Infection (Viral / Bronchial)',
    diagnosis: 'Acute Upper Respiratory Tract Infection with Dry Cough',
    medicines: [
      {
        name: 'Levocetirizine + Montelukast',
        strength: '5 mg + 10 mg',
        form: 'Tablet',
        dosage: '1 tab',
        frequency: 'Once daily at bedtime',
        duration: '7 days',
        timing: 'At night',
        instructions: 'May cause mild drowsiness; take with water'
      },
      {
        name: 'Dextromethorphan + Chlorpheniramine Syrup',
        strength: '100 ml',
        form: 'Syrup',
        dosage: '10 ml',
        frequency: 'Three times daily',
        duration: '5 days',
        timing: 'After meals',
        instructions: 'Shake well before use'
      },
      {
        name: 'Paracetamol IP',
        strength: '650 mg',
        form: 'Tablet',
        dosage: '1 tab SOS',
        frequency: 'Every 6-8 hours as needed',
        duration: '3 days',
        timing: 'After food',
        instructions: 'Only if body temperature exceeds 99.5°F or body aches occur'
      }
    ],
    advice: 'Drink warm fluids, steam inhalation twice a day, avoid cold drinks or fried foods.'
  },
  {
    name: 'Hypertension Maintenance Protocol',
    diagnosis: 'Essential Hypertension (Stage 1 / 2)',
    medicines: [
      {
        name: 'Telmisartan Tablets IP',
        strength: '40 mg',
        form: 'Tablet',
        dosage: '1 tab',
        frequency: 'Once daily',
        duration: '30 days',
        timing: 'Morning after breakfast',
        instructions: 'Do not skip doses; maintain BP log twice weekly'
      },
      {
        name: 'Amlodipine Besylate',
        strength: '5 mg',
        form: 'Tablet',
        dosage: '1 tab',
        frequency: 'Once daily',
        duration: '30 days',
        timing: 'Evening',
        instructions: 'Report any ankle swelling or dizziness'
      }
    ],
    advice: 'Strict low salt diet (<3g/day), 30 minutes daily aerobic exercise, avoid smoking and alcohol.'
  },
  {
    name: 'Acid Peptic Disease / GERD Protocol',
    diagnosis: 'Gastroesophageal Reflux Disease (GERD) with Dyspepsia',
    medicines: [
      {
        name: 'Pantoprazole + Domperidone SR',
        strength: '40 mg + 30 mg',
        form: 'Capsule',
        dosage: '1 cap',
        frequency: 'Once daily',
        duration: '14 days',
        timing: '30 minutes before breakfast',
        instructions: 'Take on an empty stomach with a full glass of water'
      },
      {
        name: 'Magaldrate + Simethicone Antacid Gel',
        strength: '200 ml',
        form: 'Syrup',
        dosage: '15 ml',
        frequency: 'After meals and bedtime',
        duration: '7 days',
        timing: 'After meals',
        instructions: 'Do not drink water immediately for 15 minutes after taking gel'
      }
    ],
    advice: 'Avoid spicy, oily foods; avoid lying down for 2 hours after meals; elevate head of bed.'
  }
];

export const INITIAL_LAB_REPORTS = [
  {
    id: 'lab-101',
    reportNumber: 'LAB-MCC-2026-5541',
    date: '2026-08-15',
    patientId: 'pat-1',
    patientName: 'Ananya Roy',
    doctorId: 'doc-1',
    doctorName: 'Dr. Preetam Sen',
    department: 'Hematology & Clinical Pathology',
    testTitle: 'Complete Blood Count (CBC) with Absolute Eosinophil Count',
    category: 'Pathology',
    status: 'Verified',
    summary: 'Mild eosinophilia consistent with allergic bronchial airway inflammation. Hemoglobin and platelet indices normal.',
    parameters: [
      { name: 'Hemoglobin (Hb)', result: '13.2', unit: 'g/dL', refRange: '12.0 - 15.5', status: 'Normal' },
      { name: 'Total Leucocyte Count (WBC)', result: '7,400', unit: '/mcL', refRange: '4,000 - 11,000', status: 'Normal' },
      { name: 'Absolute Eosinophil Count (AEC)', result: '480', unit: '/mcL', refRange: '40 - 400', status: 'Elevated' },
      { name: 'Platelet Count', result: '2.85', unit: 'Lakh/mcL', refRange: '1.50 - 4.50', status: 'Normal' },
      { name: 'Erythrocyte Sedimentation Rate (ESR)', result: '14', unit: 'mm/1st hr', refRange: '0 - 20', status: 'Normal' }
    ],
    pathologist: 'Dr. Amitabha Das, MD (Pathology)'
  },
  {
    id: 'lab-102',
    reportNumber: 'LAB-MCC-2026-5592',
    date: '2026-08-28',
    patientId: 'pat-2',
    patientName: 'Rahul Sharma',
    doctorId: 'doc-1',
    doctorName: 'Dr. Preetam Sen',
    department: 'Clinical Biochemistry',
    testTitle: 'Comprehensive Lipid Profile & Glycated Hemoglobin (HbA1c)',
    category: 'Biochemistry',
    status: 'Verified',
    summary: 'Borderline mixed dyslipidemia with improved glycemic control (HbA1c 6.9%). Statin and diet compliance advised.',
    parameters: [
      { name: 'Glycated Hemoglobin (HbA1c)', result: '6.9', unit: '%', refRange: '< 5.7 (Target < 7.0 in T2D)', status: 'Elevated' },
      { name: 'Estimated Average Glucose (eAG)', result: '151', unit: 'mg/dL', refRange: '70 - 140', status: 'Elevated' },
      { name: 'Fasting Blood Sugar (FBS)', result: '124', unit: 'mg/dL', refRange: '70 - 100', status: 'Elevated' },
      { name: 'Total Serum Cholesterol', result: '228', unit: 'mg/dL', refRange: '< 200', status: 'Elevated' },
      { name: 'LDL Cholesterol', result: '148', unit: 'mg/dL', refRange: '< 100', status: 'Elevated' },
      { name: 'HDL Cholesterol', result: '42', unit: 'mg/dL', refRange: '> 40', status: 'Normal' },
      { name: 'Serum Triglycerides', result: '190', unit: 'mg/dL', refRange: '< 150', status: 'Elevated' }
    ],
    pathologist: 'Dr. Amitabha Das, MD (Pathology)'
  },
  {
    id: 'lab-103',
    reportNumber: 'LAB-MCC-2026-4820',
    date: '2026-08-16',
    patientId: 'pat-1',
    patientName: 'Ananya Roy',
    doctorId: 'doc-1',
    doctorName: 'Dr. Preetam Sen',
    department: 'Radiology & Imaging',
    testTitle: 'Chest Digital Radiograph (PA View)',
    category: 'Radiology',
    status: 'Verified',
    summary: 'Chest X-Ray demonstrates clear bilateral lung fields without focal consolidation, pleural effusion, or pneumothorax. Cardiothoracic ratio normal.',
    parameters: [
      { name: 'Lung Fields', result: 'Clear, no focal infiltrates', unit: '--', refRange: 'Clear bilateral fields', status: 'Normal' },
      { name: 'Cardiothoracic Ratio', result: '0.44 (< 0.50)', unit: '--', refRange: 'Normal cardiac size', status: 'Normal' },
      { name: 'Costophrenic Angles', result: 'Sharp & clear', unit: '--', refRange: 'Sharp bilaterally', status: 'Normal' },
      { name: 'Hilar Bronchovascular Markings', result: 'Mild prominence bilaterally', unit: '--', refRange: 'Normal pattern', status: 'Normal' }
    ],
    pathologist: 'Dr. Neha Saxena, DMRD (Radiologist)'
  },
  {
    id: 'lab-104',
    reportNumber: 'LAB-MCC-2026-5103',
    date: '2026-08-20',
    patientId: 'pat-3',
    patientName: 'Sunita Menon',
    doctorId: 'doc-3',
    doctorName: 'Dr. Rajesh Kulkarni',
    department: 'Biochemistry & Bone Metabolism',
    testTitle: 'Serum Calcium, Vitamin D3 & Renal Function Panel',
    category: 'Biochemistry',
    status: 'Verified',
    summary: 'Moderate Vitamin D3 deficiency with preserved renal clearance. Calcium and D3 supplementation indicated.',
    parameters: [
      { name: 'Total Serum Calcium', result: '8.8', unit: 'mg/dL', refRange: '8.5 - 10.5', status: 'Normal' },
      { name: '25-Hydroxy Vitamin D', result: '18.4', unit: 'ng/mL', refRange: '30 - 100', status: 'Low' },
      { name: 'Serum Creatinine', result: '0.88', unit: 'mg/dL', refRange: '0.6 - 1.2', status: 'Normal' },
      { name: 'Blood Urea Nitrogen (BUN)', result: '15.2', unit: 'mg/dL', refRange: '7 - 20', status: 'Normal' }
    ],
    pathologist: 'Dr. Amitabha Das, MD (Pathology)'
  }
];
