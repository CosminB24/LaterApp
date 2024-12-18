import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ChangeItem {
  text: string;
  subpoints?: string[];
}

interface LogEntry {
  date: string;
  version: string;
  changes: {
    additions?: ChangeItem[];
    modifications?: ChangeItem[];
    bugfixes?: ChangeItem[];
  };
}

const logs: LogEntry[] = [
  {
    date: "23 Octombrie 2024",
    version: "1.0.0",
    changes: {
      additions: [
        {
          text: "A fost lansată versiunea inițială a aplicației"
        },
        {
          text: "A fost adăugată o interfață ușor de folosit pentru utilizatori"
        },
        {
          text: "A fost adăugată posibilitatea de a plasa sarcini direct în calendar, în orice zi",
          subpoints: [
            "Fiecare sarcină poate avea un titlu, o descriere și o ora la care este programată să înceapă",
            "Fiecare sarcină poate fi editată sau ștersă",
          ]
        },
        {
          text: "Fiecare zi în care este programată cel puțin o sarcină, este marcată în calendar",
        },
        {
            text: "A fost adăugată opțiunea de a schimba luna fie din sâgeți, fie dintr-un meniu tip calendar",
        }
      ]
    }
  },
  {
    date: "06 Noiembrie 2024",
    version: "1.1.0",
    changes: {
      additions: [
        {
            text: "Aplicația este accesibilă și pe dispozitivele mobile",
        },
        {
          text: "A fost adăugată opțiunea de a selecta o temă întunecată sau luminată, în funcție de preferințele utilizatorului"
        },
        {
            text: "A fost creată o pagină destinată profilului utilizatorului",
            subpoints: [
                "Utilizatorul poate să își schimbe numele și prenumele alese la crearea contului",
                "Utilizatorul își poate adăuga o poză de profil",
                "Utilizatorul poate să își adauge un număr de telefon",
                "Utilizatorul poate să își adauge o locație",
              ]
        },
        {
            text: "A fost adăugată posibilitatea de a vizualiza vremea la ora în care a fost programată o sarcină",
            subpoints: [
                "Pentru a beneficia de această funcționalitate, utilizatorul trebuie să ofere acces la locația sa",
                "Utilizatorul va selecta o sarcină din lista de sarcini existente, iar în partea de jos va apărea o secțiune cu informații despre vreme",
            ]
        },
        {
            text: "A fost adăugată o bară de căutare avansată a sarcinilor",
            subpoints: [
                "Utilizatorul poate căuta o sarcină după titlu și descriere",
                "Căutarea poate fi făcută după o parte a titlului sau descrierii",
                "Vor fi afișate toate sarcinile care conțin cuvintele căutate, alături de ora și data la care sunt programate",
            ]
        }
      ],
      modifications: [
        {
          text: "A fost modificată interfața de utilizare",
          subpoints: [
            "A fost adăugată o bară de navigare laterală",
            "A fost modificată poziționarea elementelor din pagină",
          ]
        }
      ],
      bugfixes: [
        {
          text: "Au fost traduse în română elementele ce erau în engleză"
        },
        {
          text: "Au fost corectate erorile de tipografie",
        },
        {
          text: "Au fost corectate erorile de colorizare",
        }
      ]
    }
  },
  {
    date: "09 Noiembrie 2024",
    version: "1.1.1",
    changes: {
      bugfixes: [
        {
          text: "Au fost rezolvate problemele legate de bara de căutare"
        },
        {
          text: "Au fost corectate erorile de spațiere în lista de sarcini existente",
        },
        {
          text: "Au fost rezolvate alte probleme de logică din spatele aplicației",
        }
      ]
    }
  },
  {
    date: "04 Decembrie 2024",
    version: "1.2.0",
    changes: {
      additions: [
        {
          text: "A fost adăugat un sistem de subscripție",
          subpoints: [
            "Utilizatorul poate să se aboneze la un plan de subscripție",
            "Planurile de subscripție au diferite durate și prețuri",
            "Un utilizator își poate face o subscripție lunară la prețul de 2.99€, ori anuală la prețul de 26.99€"
          ]
        }
      ]
    }
  },
  {
    date: "15 Decembrie 2024",
    version: "1.3.0",
    changes: {
      additions: [
        {
          text: "A fost adăugat un sistem de notificări prin intermediul email-ului",
          subpoints: [
            "Utilizatorul poate să își selecteze când individual, pentru fiecare sarcină, dacă dorește să fie notificat prin email",
            "Utilizatorul poate să își aleagă cu cât timp înainte să fie notificat, existând niște intervale prestabilite",
            "Perioadele disponibile sunt cu 24 de ore, 12 ore, 6 ore, 1 oră, 30 de minute și 15 minute înainte de ora la care este programată o sarcină",
          ]
        },
        {
            text: "A fost adăugată o pagină dedicată sugestiilor utilizatorilor",
            subpoints: [
                "Fiecare utilizator poate să trimită o sugestie pentru aplicație",
                "Echipa de dezvoltare a aplicației va analiza fiecare sugestie în parte, iar utilizatorii a căror propuneri vor fi implementate, vor fi răsplatiți cu o lună de beneficii Premium",
            ]
        }
      ],
      bugfixes: [
        {
          text: "Au fost rezolvate conflictele legate de paginile disponibile utilizatorilor premium",
        }
      ]
    }
  }
];

export default function DevelopmentLogs() {
  const [expandedVersions, setExpandedVersions] = useState<string[]>([]);

  const toggleVersion = (version: string) => {
    setExpandedVersions(prev => 
      prev.includes(version)
        ? prev.filter(v => v !== version)
        : [...prev, version]
    );
  };

  const renderChangeList = (items: ChangeItem[]) => (
    <ul className="space-y-2 ml-4">
      {items.map((item, index) => (
        <li key={index}>
          <div className="flex items-start">
            <span className="mr-2 mt-0.5">•</span>
            <div>
              <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
              {item.subpoints && (
                <ul className="mt-1 ml-4 space-y-1">
                  {item.subpoints.map((subpoint, subIndex) => (
                    <li key={subIndex} className="flex items-start">
                      <span className="mr-2 mt-0.5">-</span>
                      <span className="text-gray-600 dark:text-gray-400">{subpoint}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex-1 p-6 overflow-hidden dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Jurnal de Dezvoltare
      </h1>
      
      <div className="space-y-4">
        {logs.map((log, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            <button
              onClick={() => toggleVersion(log.version)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Versiunea {log.version}
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                  {log.date}
                </span>
              </div>
              {expandedVersions.includes(log.version) 
                ? <ChevronUp className="w-5 h-5 text-gray-500" />
                : <ChevronDown className="w-5 h-5 text-gray-500" />
              }
            </button>
            
            {expandedVersions.includes(log.version) && (
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                {log.changes.additions && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      ADĂUGĂRI:
                    </h3>
                    {renderChangeList(log.changes.additions)}
                  </div>
                )}
                
                {log.changes.modifications && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      MODIFICĂRI:
                    </h3>
                    {renderChangeList(log.changes.modifications)}
                  </div>
                )}
                
                {log.changes.bugfixes && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      BUGFIXES:
                    </h3>
                    {renderChangeList(log.changes.bugfixes)}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 