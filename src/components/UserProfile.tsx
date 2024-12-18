import React, { useState, useEffect } from 'react'; // Importam React si hook-urile useState si useEffect
import { useNavigate } from 'react-router-dom'; // Importam hook-ul useNavigate pt navigare
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react'; // Importam iconitele
import { useUser, useClerk } from '@clerk/clerk-react'; // Importam hook-urile pentru a obt. informatiile utilizatorului

export default function UserProfile() {
  const navigate = useNavigate(); // Initializ. hook-ul pt navigare
  const { user } = useUser(); // Obtinem informatiile utilizatorului curent
  const { user: userUpdate } = useClerk(); // Obt functiile pentru actualizarea utilizatorului
  const [isUpdating, setIsUpdating] = useState(false); // Starea pentru a verifica daca se actualizeaza profilul
  const [formData, setFormData] = useState({ // Starea pentru a gestiona datele formularului
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });

  // Actualizam formData cand se incarca datele utilizatorului
  useEffect(() => {
    if (user) {
      setFormData({ // Setam datele formularului cu informatiile utilizatorului
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phoneNumbers[0]?.phoneNumber || '',
        address: user.unsafeMetadata.address || ''
      });
    }
  }, [user]); // Dependenta este user, a.i. sa se actualizeze cand user-ul se schimba

  // Functia pentru a gestiona trimiterea formularului
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!userUpdate) return; // Verificam daca userUpdate este disponibil
    
    setIsUpdating(true); // Setam starea de actualizare la true
    
    try {
      // Actualizam numele
      const updateResult = await userUpdate.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      console.log('Rezultat actualizare:', updateResult); //rezultatul actualizarii

      // Actualiz nr de tlf
      if (formData.phone) {
        if (user?.phoneNumbers[0]) { // verif daca utilizatorul are deja un nr de tlf
          await userUpdate.updatePhoneNumber({
            phoneNumberId: user.phoneNumbers[0].id,
            phoneNumber: formData.phone
          });
        } else {
          await userUpdate.createPhoneNumber({ // Cream un nou nr de telefon daca nu exista
            phoneNumber: formData.phone
          });
        }
      }

      // Actualizam adresa in metadata
      await userUpdate.update({
        unsafeMetadata: {
          ...user?.unsafeMetadata, // Pastram celelalte date din metadata
          address: formData.address // Actualizam adresa
        }
      });

      // Reincarcam datele utilizatorului
      await user?.reload();

      // Astpt cateva secunde si apoi redirectionam
      setTimeout(() => {
        navigate('/dashboard'); // Navigam spre dashboard
      }, 1000);

    } catch (error) {
      console.error('Eroare la actualizarea profilului:', error);
    } finally {
      setIsUpdating(false); 
    }
  };

  // Functia pt schimbarea imaginii de profil
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // obt fisierul ales/selectat
    if (file && userUpdate) {
      try {
        await userUpdate.setProfileImage({ file }); // actualizam imaginea
      } catch (error) {
        console.error('Eroare la actualizarea imaginii:', error); 
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900"> {/* Container principal */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8"> {/* Container pentru centrare */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"> {/* Card pentru profil */}
          <div className="relative h-48 rounded-t-2xl bg-gradient-to-r from-blue-500 to-purple-600"> {/* Header cu gradient */}
            <div className="absolute -bottom-16 left-8"> {/* Pozitionarea imaginii de profil */}
              <div className="relative">
                <img
                  src={user?.imageUrl || 'https://via.placeholder.com/256'} // Imaginea de profil
                  alt="Profile"
                  className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-800 object-cover"
                />
                <label className="absolute bottom-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"> {/* Label pentru schimbarea imaginii */}
                  <Camera className="w-5 h-5 text-gray-600 dark:text-gray-300" /> {/* Iconita pentru camera */}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden" // Input-ul este ascuns
                    onChange={handleImageChange} // Apelam functia la schimbarea imaginii
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-20 pb-8 px-8"> {/* Container pentru formular */}
            <form onSubmit={handleSubmit} className="space-y-8"> {/* Formularul pentru actualizarea profilului */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Grid pentru campurile formularului */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> {/* Eticheta pentru prenume */}
                    Prenume
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" /> {/* Iconita pentru utilizator */}
                    </div>
                    <input
                      type="text"
                      value={formData.firstName} // Valoarea campului este legata de state
                      onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))} // Actualizam prenumele
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> {/* Eticheta pentru nume */}
                    Nume
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" /> {/* Iconita pentru utilizator */}
                    </div>
                    <input
                      type="text"
                      value={formData.lastName} // Valoarea campului este legata de state
                      onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))} // Actualizam numele
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> {/* Eticheta pentru email */}
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" /> {/* Iconita pentru email */}
                    </div>
                    <input
                      type="email"
                      value={user?.emailAddresses[0]?.emailAddress || ''} // Valoarea campului este email-ul utilizatorului
                      disabled // Campul este dezactivat
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> {/* Eticheta pentru telefon */}
                    Telefon
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" /> {/* Iconita pentru telefon */}
                    </div>
                    <input
                      type="tel"
                      value={formData.phone} // Valoarea campului este legată de state
                      onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} // Actualizăm telefonul
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="md:col-span-2"> {/* Camp pentru locatie care ocupa doua coloane */}
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"> {/* Eticheta pentru locatie */}
                    Locație
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" /> {/* Iconita pentru locatie */}
                    </div>
                    <input
                      type="text"
                      value={formData.address} // Valoarea campului este legata de state
                      onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} // Actualizam adresa
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4"> {/* Container pentru butoane */}
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')} // Navigam inapoi la dashboard
                  className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Înapoi
                </button>
                <button
                  type="submit" // Buton pentru a trimite formularul
                  disabled={isUpdating} // Dezactivam butonul in timpul actualizarii
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                >
                  <Save className="w-5 h-5 mr-2" /> {/* Iconita pentru salvare */}
                  {isUpdating ? "Se salvează..." : "Salvează modificările"} {/* Textul butonului */}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}