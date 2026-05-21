import { Injectable, Logger } from '@nestjs/common';
import * as rawData from '../data/mlas.json';
interface MlaRecord {
  content: string;
  source: string;
}
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly mlas: MlaRecord[];
  constructor() {
    const data = (rawData as any).default ?? rawData;
    this.mlas = Array.isArray(data) ? data : Object.values(data);
    console.log('✅ MLA records loaded:', this.mlas.length);
  }
  getAnswer(question: string, lang: string = 'English'): string {
    const q = question.trim().toLowerCase();
    console.log('📩 Question:', q);
    // ─────────────────────────────────────────────
    // 1. GREETINGS & SMALL TALK
    // ────────────────────────────────────────────
    if (['hi ', 'hello', 'hey', 'നമസ്കാരം', 'ഹലോ', 'good morning', 'good evening'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'നമസ്കാരം! 😊 ഞാൻ EnteMLA-യുടെ സഹായി ആണ്. താങ്കൾക്ക് എന്ത് സഹായം വേണം?'
        : 'Hello! 😊 I\'m the EnteMLA Assistant. How can I help you today?';
    }

    if (['thank', 'നന്ദി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'സന്തോഷം! 😊 മറ്റ് ചോദ്യങ്ങൾ ഉണ്ടെങ്കിൽ ചോദിക്കാം.'
        : 'You\'re welcome! 😊 Feel free to ask anything else.';
    }

    if (['bye', 'goodbye', 'see you', 'പോകട്ടെ', 'താങ്ക്സ്'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ശരി, പോകട്ടെ! 👋 EnteMLA എപ്പോഴും സഹായത്തിന് തയ്യാർ.'
        : 'Goodbye! 👋 EnteMLA is always here to help you.';
    }

    // ─────────────────────────────────────────────
    // 2. ABOUT ENTEMLA
    // ─────────────────────────────────────────────

    if (['what is entemla', 'about entemla', 'എന്താണ് entemla'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'EnteMLA കേരളത്തിലെ പൗരന്മാർക്ക് MLA-യ്ക്ക് നേരിട്ട് പരാതി നൽകാനുള്ള സൗജന്യ പോർട്ടൽ ആണ്.'
        : 'EnteMLA is a free citizen grievance portal to register complaints directly to your MLA online.';
    }

    if (['who made', 'who built', 'who created', 'who developed', 'corestone'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'EnteMLA നിർമ്മിച്ചത് Corestone Innovations ആണ്.'
        : 'EnteMLA is designed and developed by Corestone Innovations.';
    }

    if (['government site', 'കേരള സർക്കാർ ഔദ്യോഗിക വെബ്സൈറ്റ്'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'EnteMLA ആപ്ലിക്കേഷൻ രൂപകൽപ്പന ചെയ്തും നിർമ്മിച്ചതും "Corestone Innovations" ആണ്. അത്യാധുനിക സാങ്കേതികവിദ്യയിലൂടെ പൗരന്മാർക്കും ജനപ്രതിനിധികൾക്കും ഇടയിലുള്ള ആശയവിനിമയം എളുപ്പമാക്കുകയാണ് ഞങ്ങളുടെ ലക്ഷ്യം.'
        : 'EnteMLA is proudly designed and developed by Corestone Innovations. Our vision is to bridge the gap between citizens and their representatives using modern, reliable technology solutions.';
    }

    if (['free', 'cost', 'charge', 'fee', 'സൗജന്യം'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'അതെ! EnteMLA കേരളത്തിലെ എല്ലാ പൗരന്മാർക്കും തികച്ചും സൗജന്യമാണ്.'
        : 'EnteMLA is completely free for all citizens of Kerala.';
    }

    if (['who can use', 'eligible', 'who can file', 'ആർക്ക് ഉപയോഗിക്കാം', 'ആർക്ക് പരാതി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'കേരളത്തിലെ ഏത് പൗരനും EnteMLA ഉപയോഗിക്കാം. ഒരു സ്മാർട്ട്ഫോണും ഇന്റർനെറ്റ് കണക്ഷനും ഉണ്ടെങ്കിൽ മതിയാകും.'
        : 'Any citizen of Kerala can use EnteMLA. All you need is a smartphone and an internet connection.';
    }

    if (['portal available', '24 hours', 'anytime', '24/7', 'എപ്പോഴും ഉപയോഗിക്കാം'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'EnteMLA പോർട്ടൽ 24/7 ലഭ്യമാണ്. ഏത് സമയത്തും നിങ്ങൾക്ക് പരാതി സമർപ്പിക്കാം.'
        : 'The EnteMLA portal is available 24/7. You can submit complaints at any time of the day.';
    }

    if (['mobile app', 'android', 'ios', 'app download', 'play store', 'മൊബൈൽ ആപ്പ്'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'EnteMLA ഇപ്പോൾ വെബ് പോർട്ടലായി ലഭ്യമാണ്. മൊബൈൽ ആപ്പ് ഉടൻ വരുന്നതാണ്. Chrome ബ്രൗസർ ഉപയോഗിച്ച് മൊബൈലിൽ ആക്സസ് ചെയ്യാം.'
        : 'EnteMLA is currently available as a web portal. A dedicated mobile app is coming soon. You can access it via Chrome browser on your mobile device.';
    }

    if (['outside kerala', 'other state', 'not in kerala', 'കേരളത്തിന് പുറത്ത്', 'മറ്റ് സംസ്ഥാനം'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'EnteMLA കേരളത്തിലെ പൗരന്മാർക്ക് മാത്രമായി രൂപകൽപ്പന ചെയ്തിട്ടുള്ളതാണ്. മറ്റ് സംസ്ഥാനങ്ങൾക്ക് ഇത് ബാധകമല്ല.'
        : 'EnteMLA is exclusively designed for citizens of Kerala. It is not applicable for complaints from other states.';
    }

    if (['language support', 'which language', 'chatbot language', 'ഏത് ഭാഷ', 'ഭാഷ പിന്തുണ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'EnteMLA ചാറ്റ്ബോട്ട് ഇംഗ്ലീഷും മലയാളവും പൂർണ്ണമായി പിന്തുണയ്ക്കുന്നു. Manglish (ഇംഗ്ലീഷ് അക്ഷരത്തിൽ മലയാളം) ഉപയോഗിച്ചും ചോദ്യങ്ങൾ ചോദിക്കാം.'
        : 'The EnteMLA chatbot fully supports both English and Malayalam. You can also type in Manglish (Malayalam written in English letters).';
    }

    if (['malayalam supported', 'english and malayalam', 'ഭാഷ', 'മലയാളം'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'അതെ! ഈ പോർട്ടൽ ഇംഗ്ലീഷും മലയാളവും പൂർണ്ണമായി പിന്തുണയ്ക്കുന്നു. നിങ്ങൾക്ക് മംഗ്ലീഷിൽ (Manglish) ടൈപ്പ് ചെയ്താൽ പോലും സിസ്റ്റം അത് മനസ്സിലാക്കി മറുപടി നൽകും.'
        : 'Yes! The application core fully respects bi-lingual query matrices. You can write commands using formal script, English, or mixed Manglish phonetics natively.';
    }

    if (['complaint in malayalam', 'complaints in malayalam', 'write in malayalam', 'മലയാളത്തിൽ പരാതി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'അതെ! നിങ്ങൾക്ക് മലയാളത്തിലോ ഇംഗ്ലീഷിലോ പരാതി സമർപ്പിക്കാം.'
        : 'Yes! You can submit your complaint in either Malayalam or English.';
    }

    // ─────────────────────────────────────────────
    // 3. ACCOUNT & LOGIN
    // ─────────────────────────────────────────────

    if (['create account', 'create an account', 'register', 'signup', 'അക്കൗണ്ട്'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'അക്കൗണ്ട് നിർമ്മിക്കാൻ:\n1. "Sign Up" അല്ലെങ്കിൽ "Register" ബട്ടൺ ക്ലിക്ക് ചെയ്യുക.\n2. പേര്, മൊബൈൽ നമ്പർ, വിലാസം എന്നിവ നൽകുക.\n3. മൊബൈലിൽ വരുന്ന OTP വെരിഫൈ ചെയ്ത് രജിസ്ട്രേഷൻ പൂർത്തിയാക്കുക.'
        : 'To create an account:\n1. Tap "Register/Sign Up" on the welcome page.\n2. Enter your name, mobile number, and address.\n3. Verify the OTP sent to your mobile to complete registration.';
    }

    if (['mobile number already exists', 'നിലവിലുണ്ട്'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'മറ്റൊരു നമ്പർ ഉപയോഗിച്ച് വീണ്ടും ശ്രമിക്കുക.'
        : 'This mobile number is already registered. Please use a different number and try again.';
    }

    if (['otp required', 'without registration', 'otp വേണോ', 'രജിസ്റ്റർ ചെയ്യാതെ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'അതെ, വ്യാജ അക്കൗണ്ടുകൾ തടയുന്നതിനായി OTP വെരിഫിക്കേഷൻ നിർബന്ധമാണ്. രജിസ്റ്റർ ചെയ്യാതെ നിങ്ങൾക്ക് വെബ്‌സൈറ്റ് ബ്രൗസ് ചെയ്യാം, എന്നാൽ പരാതി സമർപ്പിക്കാൻ രജിസ്ട്രേഷൻ വേണം.'
        : 'Yes, OTP verification is mandatory to prevent fake accounts. You can browse the website without registering, but submitting a complaint requires registration.';
    }

    if (['otp not', 'otp varunnilla', 'ഒടിപി', 'otp വരുന്നില്ല'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'മൊബൈൽ നെറ്റ്‌വർക്ക് പരിധിയിൽ ആണെന്ന് ഉറപ്പാക്കുക. 2 മിനിറ്റ് കാത്തിരുന്ന ശേഷം "Resend OTP" ബട്ടൺ ക്ലിക്ക് ചെയ്യുക. പ്രശ്നം തുടരുകയാണെങ്കിൽ നിങ്ങളുടെ SMS ഇൻബോക്സ് ഫുൾ ആണോ എന്ന് നോക്കുക.'
        : 'Make sure your mobile has network coverage. Wait 2 minutes then tap "Resend OTP". If the problem continues, check if your SMS inbox is full.';
    }

    if (['login fail', 'cannot login', 'ലോഗിൻ ചെയ്യാൻ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'തെറ്റായ മൊബൈൽ നമ്പറോ പാസ്‌വേഡോ നൽകുന്നത് കൊണ്ടാകാം ഇത്. ഇന്റർനെറ്റ് കണക്ഷൻ ഉറപ്പാക്കുക. പ്രശ്നം തുടരുകയാണെങ്കിൽ പാസ്‌വേഡ് റീസെറ്റ് ചെയ്യുക.'
        : 'This may be due to an incorrect mobile number or password. Check your internet connection. If the problem persists, reset your password using "Forgot Password".';
    }

    if (['login', 'log in', 'sign in', 'ലോഗിൻ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ലോഗിൻ നിർബന്ധമാണ്. ലോഗിൻ ചെയ്യാൻ ഫോൺ നമ്പറും പാസ്‌വേഡും നൽകുക.\n\nപാസ്‌വേഡ് മറന്നോ? "Forgot Password" ക്ലിക്ക് ചെയ്ത് ഫോൺ നമ്പർ നൽകുക.'
        : 'Login is required. Enter your phone number and password to log in.\n\nForgot password? Click "Forgot Password" and enter your phone number.';
    }

    if (['password', 'reset', 'forgot', 'പാസ്‌വേഡ്'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'പാസ്‌വേഡ് മറന്നുപോയെങ്കിൽ, ലോഗിൻ പേജിലെ "Forgot Password" ലിങ്കിൽ ക്ലിക്ക് ചെയ്ത് രജിസ്റ്റർ ചെയ്ത മൊബൈൽ നമ്പറിലേക്ക് വരുന്ന OTP വഴി പുതിയ പാസ്‌വേഡ് സെറ്റ് ചെയ്യാം.'
        : 'If you forgot your password, click "Forgot Password" on the login page and enter your registered mobile number. You will receive an OTP to set a new password.';
    }

    if (['change mobile', 'change phone', 'മൊബൈൽ നമ്പർ മാറ്റാൻ', 'ഫോൺ നമ്പർ മാറ്റാൻ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'സുരക്ഷാ കാരണങ്ങളാൽ രജിസ്റ്റർ ചെയ്ത മൊബൈൽ നമ്പർ സ്വയം മാറ്റാൻ കഴിയില്ല. ഇതിനായി EnteMLA ഹെൽപ്ഡെസ്കുമായി നേരിട്ട് ബന്ധപ്പെടണം.'
        : 'For security reasons, you cannot change your registered mobile number on your own. Please contact the EnteMLA helpdesk directly to update it.';
    }

    if (['update profile', 'edit profile', 'വിവരങ്ങൾ മാറ്റാൻ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ലോഗിൻ ചെയ്ത ശേഷം "Profile Settings" സെക്ഷൻ വഴി വിലാസവും മറ്റ് വിവരങ്ങളും മാറ്റാം. എന്നാൽ സുരക്ഷ മുൻനിർത്തി മൊബൈൽ നമ്പർ മാറ്റാൻ ഹെൽപ്പ്ഡെസ്കുമായി ബന്ധപ്പെടണം.'
        : 'After logging in, go to "Profile Settings" to update your address and other details. To change your mobile number, contact the helpdesk for security reasons.';
    }

    // ─────────────────────────────────────────────
    // 4. FILING A COMPLAINT
    // ─────────────────────────────────────────────

    if (['register a complaint','complain ', 'register a new grievance','പരാതി രജിസ്റ്റർ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'വിശദാംശങ്ങൾ നൽകി കാറ്റഗറി തിരഞ്ഞെടുക്കുന്നതിലൂടെ പരാതി പോർട്ടൽ വഴി നിങ്ങൾക്ക് പരാതി സമർപ്പിക്കാം!'
        : 'You can submit/register a complaint through the Complaint Portal by providing details and selecting the appropriate category.';
    }

    if (
      (['detail', 'details are mandatory','information', 'require', 'what do i need', 'document', 'mandatory', 'വിവരങ്ങൾ', 'എന്തൊക്കെ വേണം'].some(w => q.includes(w))) &&
      (['complaint', 'need to submit', 'grievance', 'issue', 'പരാതി'].some(w => q.includes(w)))
    ) {
      return lang === 'Malayalam'
        ? 'പരാതി സമർപ്പിക്കാൻ താഴെ പറയുന്ന വിവരങ്ങൾ ആവശ്യമാണ്:\n• പരാതിയുടെ വിഷയം (Category/Type)\n• കൃത്യമായ സ്ഥലം/വിലാസം\n• പ്രശ്നത്തിന്റെ വിവരണം (Description)\n• സപ്പോർട്ടിങ് ഫോട്ടോകൾ അല്ലെങ്കിൽ രേഖകൾ (ഉണ്ടെങ്കിൽ മാത്രം)'
        : 'To submit a complaint, you will need:\n• Complaint Category (e.g., Roads, Water)\n• Location of the issue\n• Detailed description of the problem\n• Supporting photos or documents (Optional)';
    }

    if (['which category', 'what category', 'choose category', 'select category', 'ഏത് കാറ്റഗറി', 'കാറ്റഗറി തിരഞ്ഞെടുക്കാൻ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'നിങ്ങളുടെ പ്രശ്നത്തിന് ഏറ്റവും അടുത്ത കാറ്റഗറി തിരഞ്ഞെടുക്കുക:\n• റോഡ് / ഗതാഗതം → PWD\n• കുടിവെള്ളം → KWA\n• വൈദ്യുതി → KSEB\n• ആരോഗ്യം, ഭവനം, വിദ്യാഭ്യാസം\n• മറ്റുള്ളവ → Administrative / Others\n\nശരിയായ കാറ്റഗറി തിരഞ്ഞെടുത്താൽ പ്രശ്നം വേഗത്തിൽ പരിഹരിക്കാൻ സഹായിക്കും.'
        : 'Choose the category that best matches your issue:\n• Road / Transport → PWD\n• Drinking Water → KWA\n• Electricity → KSEB\n• Health, Housing, Education\n• Others → Administrative / Others\n\nSelecting the correct category helps resolve your complaint faster.';
    }

    if (['type of complaint', 'kind of complaint', 'what complaint', 'which complaint', 'വിഭാഗം'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ഈ വിഷയങ്ങളിൽ പരാതി നൽകാം:\n• റോഡ്, ഗതാഗതം\n• ജലവിതരണം\n• വൈദ്യുതി\n• പൊതുജനാരോഗ്യം\n• ഭവനം\n• വിദ്യാഭ്യാസം\n• മറ്റ് പൗര പ്രശ്നങ്ങൾ'
        : 'You can file complaints about:\n• Roads and transport\n• Water supply\n• Electricity\n• Public health\n• Housing\n• Education\n• Other civic issues';
    }

    if (['road', 'water', 'electricity', 'waste', 'kseb', 'kwa', 'pwd', 'റോഡ്', 'വെള്ളം', 'കരണ്ട്', 'മാലിന്യം'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'അതെ! റോഡ് തകർച്ച, കുടിവെള്ള മുടക്കം, തെരുവ് വിളക്കുകൾ, ട്രാൻസ്ഫോർമർ തകരാറുകൾ, പൊതുമാലിന്യ പ്രശ്നങ്ങൾ എന്നിവ ബന്ധപ്പെട്ട വകുപ്പ് കാറ്റഗറി തിരഞ്ഞെടുത്ത് ഇവിടെ ഫയൽ ചെയ്യാം.'
        : 'Yes! You can report road damage (PWD), water supply issues (KWA), electricity faults (KSEB), street lights, and public waste issues by selecting the relevant category.';
    }

    if (['corruption', 'misconduct', 'അഴിമതി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ഔദ്യോഗിക അഴിമതി അല്ലെങ്കിൽ ഉദ്യോഗസ്ഥരുടെ മോശം പെരുമാറ്റം എന്നിവയ്ക്കെതിരെ "Administrative / Others" കാറ്റഗറി തിരഞ്ഞെടുത്ത് കൃത്യമായ തെളിവുകളോടെ പരാതി സമർപ്പിക്കാം.'
        : 'Complaints regarding official corruption or misconduct can be filed under the "Administrative / Others" category. Provide supporting documents for faster processing.';
    }

    if (['village', 'ward', 'panchayat', 'gram', 'പഞ്ചായത്ത്', 'വാർഡ്'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'അതെ! ഗ്രാമ പഞ്ചായത്ത്, നഗരസഭ, മുനിസിപ്പാലിറ്റി തല പ്രശ്നങ്ങളും MLA-യ്ക്ക് ബോധ്യപ്പെടുത്തി പരിഹരിക്കാൻ EnteMLA ഉപയോഗിക്കാം.'
        : 'Yes! Issues at gram panchayat, municipality, or ward level can also be reported through EnteMLA to bring them to the MLA\'s attention.';
    }

    if (['anonymous', 'anonymously', 'without name', 'പേര് പറയാതെ', 'പേര് വെക്കാതെ', 'രഹസ്യമായി', 'അജ്ഞാത', 'can i file anonymously'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ഇല്ല, അജ്ഞാതമായി (Anonymous) പരാതി നൽകാൻ സാധിക്കില്ല. വ്യാജ പരാതികൾ ഒഴിവാക്കാനും ഉദ്യോഗസ്ഥർക്ക് നിങ്ങളുമായി ബന്ധപ്പെടാനും ഫോൺ നമ്പർ വെരിഫിക്കേഷൻ നിർബന്ധമാണ്.'
        : 'No, anonymous complaints are not supported. Phone number verification is mandatory to prevent fake complaints and allow departments to contact you if needed.';
    }

    if (['behalf', 'someone else', 'another person', 'മറ്റൊരാൾക്ക് വേണ്ടി', 'വേറൊരാൾക്ക്'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'അതെ! നിങ്ങൾക്ക് മറ്റൊരാൾക്ക് വേണ്ടി പരാതി സമർപ്പിക്കാൻ സാധിക്കും. പക്ഷേ ബന്ധപ്പെട്ട വ്യക്തിയുടെ കൃത്യമായ വിവരങ്ങൾ ഉൾപ്പെടുത്തണം.'
        : 'Yes! You can file a complaint on behalf of someone else. Make sure to include the correct details of the affected person.';
    }

    if (['phone call', 'call to complain', 'submit by call', 'ഫോൺ വഴി പരാതി', 'വിളിച്ചു പരാതി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ഇല്ല, നിലവിൽ ഫോൺ കോൾ വഴി പരാതി സ്വീകരിക്കുന്നില്ല. EnteMLA പോർട്ടലിലൂടെ മാത്രമേ ഓൺലൈൻ പരാതി സമർപ്പിക്കാൻ സാധിക്കൂ.'
        : 'No, complaints cannot be submitted via phone call at this time. Please use the EnteMLA web portal to file your complaint online.';
    }

    if (['whatsapp', 'whatsapp number', 'വാട്സ്ആപ്പ്'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'നിലവിൽ EnteMLA-ക്ക് ഔദ്യോഗിക WhatsApp നമ്പർ ഇല്ല. പരാതികൾ പോർട്ടൽ വഴി മാത്രം സമർപ്പിക്കാം. കൂടുതൽ സഹായത്തിന് "Contact Us" പേജ് സന്ദർശിക്കുക.'
        : 'EnteMLA does not have an official WhatsApp number. Complaints can only be submitted through the portal. Visit the "Contact Us" page for more support options.';
    }

    if (['how many complaint', 'limit', 'maximum complaint', 'എത്ര പരാതി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ഒരു യൂസർക്ക് ഒന്നിലധികം പരാതികൾ നൽകാം. ഓരോ പരാതിക്കും പ്രത്യേക ട്രാക്കിംഗ് ID ലഭിക്കുന്നതാണ്.'
        : 'There is no limit on the number of complaints you can file. Each complaint gets a unique tracking ID.';
    }

    if (['multiple complaints', 'more than one', 'another complaint', 'രണ്ടാമത്തെ', 'ഒന്നിലധികം', 'കൂടുതൽ പരാതി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'അതെ! നിങ്ങൾക്ക് ഒന്നിലധികം പരാതികൾ സമർപ്പിക്കാം. ഓരോ പരാതിക്കും പ്രത്യേക ട്രാക്കിംഗ് ID ലഭിക്കുന്നതായിരിക്കും.'
        : 'Yes! You can submit multiple complaints. Each complaint will be assigned a unique tracking ID so you can track them individually.';
    }

    if (['wrong constituency', 'wrong area', 'different area', 'തെറ്റായ മണ്ഡലം'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'നിങ്ങൾ തെറ്റായ മണ്ഡലത്തിൽ പരാതി നൽകിയാൽ അത് നിരസിക്കപ്പെടാം. ശരിയായ MLA-യുടെ കീഴിൽ ഉൾപ്പെടുന്ന മണ്ഡലത്തിൽ മാത്രം പരാതി നൽകുക.'
        : 'If you file a complaint in the wrong constituency, it may be rejected. Make sure to file under the correct MLA and constituency that covers your area.';
    }

    if (['upload photos', 'upload documents', 'include photos', 'include documents', 'attach'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'അതെ! പരാതി സമർപ്പിക്കുന്നതിനോടൊപ്പം നിങ്ങൾക്ക് ഫോട്ടോകളും രേഖകളും അപ്‌ലോഡ് ചെയ്യാൻ സാധിക്കും. ഇത് പ്രശ്നം വേഗത്തിൽ പരിഹരിക്കാൻ സഹായിക്കും.'
        : 'Yes! You can upload photos and documents along with your complaint. This helps us understand your issue more clearly and resolve it faster.';
    }

    if (['proof', 'evidence', 'without photo', 'no document', 'തെളിവ്', 'ഫോട്ടോ ഇല്ലെങ്കിൽ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ഫോട്ടോ അല്ലെങ്കിൽ രേഖകൾ ഓപ്ഷണൽ ആണ്. തെളിവുകൾ ഇല്ലെങ്കിലും പരാതി സ്വീകരിക്കുന്നതാണ്. എന്നാൽ ഫോട്ടോ ഉണ്ടെങ്കിൽ പ്രശ്നം വേഗത്തിൽ പരിഹരിക്കാൻ സഹായിക്കും.'
        : 'Photos and documents are optional. Complaints are accepted without them. However, attaching photos helps resolve the issue faster.';
    }

    if (['file formats', 'format', 'pdf', 'jpg', 'png'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? '📄 Documents: PDF\n📷 Images: JPG, JPEG, PNG (പരമാവധി 5MB)'
        : '📄 Documents: PDF\n📷 Images: JPG, JPEG, PNG (Max 5MB)';
    }

    // ─────────────────────────────────────────────
    // 5. AFTER SUBMITTING — PROCESS & TRACKING
    // ─────────────────────────────────────────────

    if (
      ['what happens', 'after submit', 'after filing', 'entha sambhavika', 'ശേഷം'].some(w => q.includes(w)) &&
      ['complaint', 'submit', 'parathi', 'പരാതി'].some(w => q.includes(w))
    ) {
      return lang === 'Malayalam'
        ? 'പരാതി സമർപ്പിച്ചതിന് ശേഷം:\n1. നിങ്ങൾക്ക് ഒരു തനത് Tracking ID ലഭിക്കും.\n2. MLA ഓഫീസ് നിങ്ങളുടെ പരാതി പരിശോധിച്ച് ബന്ധപ്പെട്ട വകുപ്പിലേക്ക് കൈമാറും.\n3. പരാതിയുടെ പുരോഗതി ഡാഷ്ബോർഡിലൂടെ ട്രാക്ക് ചെയ്യാം.'
        : 'After submitting a complaint:\n1. You will receive a unique Tracking ID.\n2. The MLA office will verify it and forward it to the concerned department.\n3. You can track the progress in real-time using your dashboard.';
    }

    if (['what is my tracking id', 'find tracking id', 'where is tracking id', 'tracking id എവിടെ', 'ട്രാക്കിംഗ് ഐഡി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'പരാതി സമർപ്പിച്ചതിന് ശേഷം Tracking ID സ്ക്രീനിൽ കാണിക്കുന്നതാണ്. "My Complaints" ഡാഷ്ബോർഡിൽ ലോഗിൻ ചെയ്ത് എല്ലാ പരാതികളുടെയും ID കാണാം.'
        : 'Your Tracking ID is displayed on screen immediately after submitting a complaint. You can also find it by logging into your dashboard under the "My Complaints" section.';
    }

    if (['check status', 'track', 'status engane', 'complaint status', 'handling my complaint'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'നിങ്ങളുടെ പരാതി ട്രാക്ക് ചെയ്യാൻ:\n1. "Track Complaint" ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക.\n2. Tracking ID നൽകുക.\n3. നിലവിലെ അവസ്ഥ (Pending, In Progress, Resolved) കാണാം.'
        : 'To check your complaint status:\n1. Go to the "Track Complaint" section.\n2. Enter your Tracking ID.\n3. The current status (Pending, In Progress, Resolved) will be shown.';
    }

    if (['complaint number is not working', 'പരാതി നമ്പർ പ്രവർത്തിക്കുന്നില്ല'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'പരാതി നമ്പർ ശരിയായി നൽകിയിട്ടുണ്ടോ എന്ന് പരിശോധിക്കുക. പ്രശ്നം തുടരുകയാണെങ്കിൽ കുറച്ച് സമയം കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുകയോ ഹെൽപ്ഡെസ്കുമായി ബന്ധപ്പെടുകയോ ചെയ്യുക.'
        : 'Please verify your complaint number and try again. If the problem continues, contact support or try again after a few minutes.';
    }

    if (['mla directly', 'mla see', 'mla kanumo', 'നേരിട്ട്'].some(w => q.includes(w)) &&
        ['complaint', 'see', 'view', 'parathi', 'പരാതി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'നിങ്ങളുടെ പരാതികൾ ആദ്യം MLA-യുടെ പ്രത്യേക കോർഡിനേഷൻ ടീം പരിശോധിക്കുന്നു. അവർ ഇത് ബന്ധപ്പെട്ട ഉദ്യോഗസ്ഥർക്ക് കൈമാറുകയും, പ്രധാനപ്പെട്ട വിഷയങ്ങൾ MLA-യുടെ നേരിട്ടുള്ള ശ്രദ്ധയിൽ കൊണ്ടുവരികയും ചെയ്യും.'
        : 'Complaints are first reviewed by the MLA\'s dedicated coordination team. They forward issues to the relevant department, while critical matters are flagged for the MLA\'s direct attention.';
    }

    if (['department', 'vakuppu', 'who handles', 'ഏത് വകുപ്പ്'].some(w => q.includes(w)) &&
        ['complaint', 'handle', 'route', 'parathi', 'പരാതി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'നിങ്ങൾ പരാതി നൽകുമ്പോൾ തിരഞ്ഞെടുക്കുന്ന കാറ്റഗറി അനുസരിച്ചാണ് വകുപ്പ് നിശ്ചയിക്കുന്നത്. ഉദാ: റോഡ് → PWD, കുടിവെള്ളം → KWA.'
        : 'The department is determined by the category you select. For example: road issues → PWD, drinking water → KWA.';
    }

    if (['sms', 'email', 'notification', 'മെസ്സേജ്', 'അറിയിപ്പ്'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'അതെ! പരാതി രജിസ്റ്റർ ചെയ്യുമ്പോഴും പരിഹരിക്കപ്പെടുമ്പോഴും രജിസ്റ്റർ ചെയ്ത നമ്പറിലേക്ക് ഓട്ടോമാറ്റിക് SMS അറിയിപ്പുകൾ ലഭിക്കുന്നതാണ്.'
        : 'Yes! You will receive automatic SMS notifications on your registered mobile number when your complaint is submitted and when its status changes.';
    }

    // ─────────────────────────────────────────────
    // 6. COMPLAINT STATUS MEANINGS
    // ─────────────────────────────────────────────

    if (q.includes('pending') || q.includes('പെൻഡിങ്')) {
      return lang === 'Malayalam'
        ? '"Pending" എന്നാൽ നിങ്ങളുടെ പരാതി സിസ്റ്റത്തിൽ ലഭിച്ചു എന്നും, MLA ഓഫീസ് അത് പരിശോധിക്കാൻ കാത്തിരിക്കുകയാണ് എന്നും അർത്ഥമാക്കുന്നു.'
        : '"Pending" means your complaint has been successfully received and is waiting to be reviewed by the MLA office team.';
    }

    if (q.includes('in progress') || q.includes('പ്രോഗ്രസ്')) {
      return lang === 'Malayalam'
        ? '"In Progress" എന്നാൽ നിങ്ങളുടെ പരാതി ഓഫീസ് പരിശോധിക്കുകയും ബന്ധപ്പെട്ട സർക്കാർ വകുപ്പിലേക്ക് (PWD, KWA, KSEB) കൈമാറി നടപടികൾ ആരംഭിച്ചു എന്നും അർത്ഥമാക്കുന്നു.'
        : '"In Progress" means your complaint has been verified by the MLA office and forwarded to the relevant government department for resolution.';
    }

    if (q.includes('resolved') || q.includes('തീർപ്പായ')) {
      return lang === 'Malayalam'
        ? '"Resolved" എന്നാൽ ബന്ധപ്പെട്ട വകുപ്പ് ആവശ്യമായ നടപടികൾ സ്വീകരിച്ച് പ്രശ്നം പൂർണ്ണമായി പരിഹരിച്ചു എന്ന് രേഖപ്പെടുത്തിയിരിക്കുന്നു.'
        : '"Resolved" means the concerned department has completed the necessary action and officially closed your complaint.';
    }

    if (
      ['status', 'track', 'സ്റ്റാറ്റസ്', 'സ്ഥിതി'].some(w => q.includes(w)) &&
      ['grievance', 'issue', 'പരാതി'].some(w => q.includes(w))
    ) {
      return lang === 'Malayalam'
        ? 'പരാതിയുടെ ഗൗരവവും വകുപ്പിന്റെ ജോലിഭാരവും അനുസരിച്ച് മിക്ക പരാതികളും 48 മണിക്കൂറിൽ നിന്ന് 7 പ്രവൃത്തി ദിവസത്തിനുള്ളിൽ പരിഹരിക്കപ്പെടും.'
        : 'Most complaints are resolved within 48 hours to 7 working days depending on the severity and department workload.';
    }

    if (
      ['know if', 'epol pariharikum', 'എങ്ങനെ അറിയാം'].some(w => q.includes(w)) &&
      ['complaint', 'status', 'parathi', 'പരാതി'].some(w => q.includes(w))
    ) {
      return lang === 'Malayalam'
        ? 'പരാതി പൂർണ്ണമായി പരിഹരിക്കപ്പെടുമ്പോൾ ഡാഷ്ബോർഡിലെ സ്റ്റാറ്റസ് "Resolved" ആകും. കൂടാതെ രജിസ്റ്റർ ചെയ്ത നമ്പറിലേക്ക് SMS ലഭിക്കുകയും ചെയ്യും.'
        : 'When your complaint is resolved, the status on your dashboard will change to "Resolved" and you will receive an SMS on your registered mobile number.';
    }

    // ─────────────────────────────────────────────
    // 7. MANAGING COMPLAINTS
    // ─────────────────────────────────────────────

    if (['edit', 'modify', 'മാറ്റാൻ', 'തിരുത്താൻ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ഇല്ല, സമർപ്പിച്ചതിന് ശേഷം പരാതി തിരുത്താൻ (Edit) കഴിയില്ല. മാറ്റം വേണ്ടെങ്കിൽ നിലവിലെ പരാതി പിൻവലിച്ച് പുതിയൊരു പരാതി സമർപ്പിക്കാം.'
        : 'No, you cannot edit a complaint once submitted. If you need changes, withdraw the current complaint and submit a new one with the correct information.';
    }

    const matchesDeleteKeywords = ['delete', 'remove', 'cancel', 'withdraw', 'ഒഴിവാക്കാൻ', 'പിൻവലിക്കാൻ', 'ഡിലീറ്റ്'].some(w => q.includes(w));
    const isRelatedToComplaint = q.includes('complaint') || q.includes('issue') || q.includes('parathi') || q.includes('പരാതി');
    if (matchesDeleteKeywords && isRelatedToComplaint) {
      return lang === 'Malayalam'
        ? 'അതെ, പരാതി "Pending" സ്റ്റാറ്റസിൽ ആണെങ്കിൽ പിൻവലിക്കാം. MLA ഓഫീസ് "In Progress" ആക്കിയ ശേഷം ഡിലീറ്റ് ചെയ്യാൻ സാധിക്കില്ല.'
        : 'Yes, you can withdraw a complaint as long as its status is "Pending". Once it moves to "In Progress", it cannot be deleted.';
    }

    if (['twice', 'two times', 'by mistake', 'മാറിപ്പോയി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'അബദ്ധത്തിൽ ഒരേ പരാതി രണ്ടുതവണ പോയാൽ "My Complaints" സെക്ഷനിൽ പോയി ഒന്ന് പിൻവലിക്കുക.'
        : 'If you accidentally submitted the same complaint twice, go to "My Complaints" and withdraw the duplicate entry.';
    }

    if (['reopen', 'വീണ്ടും തുറക്കാൻ', 'not satisfied'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'നിലവിൽ Resolved പരാതികൾ Reopen ചെയ്യാൻ കഴിയില്ല. പ്രശ്നം പരിഹരിച്ചിട്ടില്ലെങ്കിൽ, പഴയ Tracking ID പരാമർശിച്ചുകൊണ്ട് പുതിയ പരാതി ഫയൽ ചെയ്യാം.'
        : 'Resolved complaints cannot be reopened directly. If the issue is not fully fixed, please file a new complaint and reference your previous Tracking ID in the description.';
    }

    if (['rejected', 'നിഷേധിച്ചു', 'തള്ളി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'അപൂർണ്ണമായ വിവരങ്ങൾ, തെറ്റായ വിലാസം, അല്ലെങ്കിൽ മണ്ഡലത്തിന് പുറത്തുള്ള പ്രദേശം കാരണം പരാതി നിരസിക്കപ്പെടാം. കൃത്യമായ കാരണം Tracking Status-ൽ കാണിച്ചിട്ടുണ്ടാകും.'
        : 'Complaints may be rejected due to incomplete information, wrong location, or the issue being outside the constituency. The exact reason will be shown in your tracking status.';
    }

    if (['history', 'മുൻപ് നൽകിയ', 'ചരിത്രം'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ലോഗിൻ ചെയ്ത ശേഷം "My Complaints" അല്ലെങ്കിൽ "Dashboard" സെക്ഷനിൽ ഇതുവരെ നൽകിയ എല്ലാ പരാതികളുടെയും ചരിത്രം കാണാം.'
        : 'After logging in, visit the "My Complaints" or "Dashboard" section to view the full history of all your submitted complaints.';
    }

    if (['feedback', 'rating', 'satisfied', 'review', 'അഭിപ്രായം', 'സംതൃപ്തി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'പരാതി പരിഹരിച്ചതിന് ശേഷം ഡാഷ്ബോർഡിൽ ഫീഡ്ബാക്ക് നൽകാൻ ഓപ്ഷൻ ലഭ്യമാണ്.'
        : 'After your complaint is resolved, you can provide feedback and rate the resolution from your dashboard.';
    }

    // ─────────────────────────────────────────────
    // 8. RESOLUTION & TIMELINES
    // ─────────────────────────────────────────────

    if (['how long', 'how much time', 'when will', 'എത്ര ദിവസം', 'എപ്പോൾ പരിഹരിക്കും'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'പ്രശ്നത്തിന്റെ ഗൗരവം അനുസരിച്ച് 48 മണിക്കൂർ മുതൽ 7 പ്രവൃത്തി ദിവസം വരെ സമയമെടുക്കാം.'
        : 'Depending on the severity of the issue, resolution can take anywhere from 48 hours to 7 working days.';
    }

    if (['resolve', 'solve', 'പരാതി പരിഹരിക്കാൻ എത്ര സമയമെടുക്കും'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'പരാതിയുടെ ഗൗരവവും വകുപ്പിന്റെ ജോലിഭാരവും അനുസരിച്ച് മിക്ക പരാതികളും 48 മണിക്കൂറിനുള്ളിൽ പരിഹരിക്കും.'
        : 'Most complaints are addressed within 48 hours depending on severity and department workload.';
    }

    if (['delay', 'വൈകുന്നു', 'no updates', 'വിവരം ഒന്നുമില്ല'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ചില പരാതികൾക്ക് ഫണ്ട് അനുമതി അല്ലെങ്കിൽ ഇന്റർ-ഡിപ്പാർട്ട്മെന്റ് അനുമതി ആവശ്യമാകാം. Tracking ID ഉപയോഗിച്ച് സ്റ്റാറ്റസ് ചെക്ക് ചെയ്യുക അല്ലെങ്കിൽ MLA ഹെൽപ്ഡെസ്കുമായി ബന്ധപ്പെടുക.'
        : 'Delays can occur if the issue requires inter-department approvals or budget sanctions. Check your dashboard for status updates or contact the MLA helpdesk.';
    }

    if (['escalate', 'no response', 'not resolved', 'ignored', 'പ്രതികരണം'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'പ്രതികരണം ഇല്ലെങ്കിൽ:\n• MLA ഓഫീസിൽ നേരിട്ട് ബന്ധപ്പെടുക\n• തിങ്കൾ-ശനി, 10AM-5PM ഓഫീസ് സന്ദർശിക്കുക\n• ജനസമ്പർക്ക പരിപാടിയിൽ പങ്കെടുക്കുക'
        : 'If you receive no response:\n• Contact the MLA office directly\n• Visit office Monday–Saturday, 10AM–5PM\n• Attend the public outreach program (ജനസമ്പർക്ക പരിപാടി)';
    }

    if (['mla term', 'mla changed', 'new mla', 'election', 'mla term ends', 'mla കാലാവധി', 'പുതിയ mla'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'MLA-യുടെ കാലാവധി അവസാനിക്കുകയോ പുതിയ MLA അധികാരമേൽക്കുകയോ ചെയ്‌താൽ Pending/In Progress പരാതികൾ ഓഫീസ് ടീം തുടർ നടപടി ഉറപ്പ് വരുത്തുന്നതാണ്.'
        : 'If the MLA\'s term ends or a new MLA takes charge, the office team ensures that existing Pending or In Progress complaints continue to be followed up and resolved.';
    }

    // ─────────────────────────────────────────────
    // 9. MLA & CONSTITUENCY INFO
    // ─────────────────────────────────────────────

    if (['who is my mla', 'contact mla', 'mla number', 'ഫോൺ നമ്പർ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'നിലവിലെ MLA-യുടെ വിവരങ്ങളും ഫോൺ നമ്പറും ഓഫീസ് വിലാസവും ഹോം പേജിലെ "About MLA / Contact Us" സെക്ഷനിൽ ലഭ്യമാണ്.'
        : 'The MLA\'s contact details, phone number, and office address are available under the "About MLA / Contact Us" section on the homepage.';
    }

    if (['which department', 'what complaints', 'ഏത് വകുപ്പ്', 'എന്ത് പരാതി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'നിങ്ങളുടെ പരാതിക്ക് അനുയോജ്യമായ വകുപ്പ് (PWD, KWA, KSEB) ലിസ്റ്റിൽ നിന്ന് കാറ്റഗറി തിരഞ്ഞെടുക്കുക.'
        : 'Select the appropriate department category (PWD, KWA, KSEB, etc.) from the dropdown list when submitting your complaint.';
    }

    if (['how many mla', 'total mla', 'kerala mla', 'എത്ര mla', 'mla എത്ര'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'കേരള നിയമസഭയിൽ ആകെ 140 MLA-കൾ ഉണ്ട്. ഓരോ നിയമസഭാ മണ്ഡലത്തിലും ഒരു MLA ഉണ്ടായിരിക്കും.'
        : 'Kerala Legislative Assembly has a total of 140 MLAs, one representing each Assembly Constituency.';
    }

    if (['how many constituency', 'total constituency', 'constituencies', 'മണ്ഡലങ്ങൾ', 'എത്ര മണ്ഡലം'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'കേരളത്തിൽ ആകെ 140 നിയമസഭാ മണ്ഡലങ്ങൾ ഉണ്ട്.'
        : 'There are a total of 140 Assembly Constituencies in Kerala.';
    }

    if (['how many district', 'total district', 'districts', 'ജില്ലകൾ', 'എത്ര ജില്ല'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'കേരളത്തിൽ ആകെ 14 ജില്ലകളാണുള്ളത്.'
        : 'There are a total of 14 administrative districts in Kerala.';
    }

    if (['my constituency', 'which constituency', 'find constituency', 'ഏത് മണ്ഡലം', 'എന്റെ മണ്ഡലം'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'നിങ്ങളുടെ മണ്ഡലം കണ്ടെത്താൻ വോട്ടർ ID കാർഡ് നോക്കുക അല്ലെങ്കിൽ Kerala Election Commission വെബ്സൈറ്റ് സന്ദർശിക്കുക.'
        : 'To find your constituency, check your Voter ID card or visit the Kerala Election Commission website.';
    }

    if (['office hour', 'office time', 'timing', 'ഓഫീസ് സമയം', 'എപ്പോൾ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ഓഫീസ് സമയം: തിങ്കൾ മുതൽ ശനി വരെ, രാവിലെ 10:00 മുതൽ വൈകിട്ട് 5:00 വരെ.'
        : 'Office hours: Monday to Saturday, 10:00 AM to 5:00 PM.';
    }

    // ─────────────────────────────────────────────
    // 10. PRIVACY, SAFETY & SUPPORT
    // ─────────────────────────────────────────────

    if (['safe', 'privacy', 'secure', 'public', 'personal data', 'സുരക്ഷിതം', 'രഹസ്യം', 'സ്വകാര്യത'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'നിങ്ങളുടെ വിവരങ്ങൾ സുരക്ഷിതമാണ്. ഫോൺ നമ്പറോ വിലാസമോ പൊതുജനങ്ങൾക്ക് കാണാൻ കഴിയില്ല. MLA ഓഫീസിനും ബന്ധപ്പെട്ട ഉദ്യോഗസ്ഥർക്കും മാത്രമേ ഇത് പരിശോധിക്കാൻ അനുമതിയുള്ളൂ.'
        : 'Your data is safe. Your phone number and address are not visible to the public. Only the MLA office and concerned officials have access to your personal details.';
    }

    if (['urgent', 'emergency', 'helpline', 'അടിയന്തിരം', 'ഹെൽപ്ലൈൻ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ശ്രദ്ധിക്കുക: EnteMLA അടിയന്തിര സഹായ പോർട്ടൽ അല്ല. അപകടങ്ങൾക്കും മെഡിക്കൽ എമർജൻസിക്കും ഔദ്യോഗിക ഹെൽപ്‌ലൈൻ 112 അല്ലെങ്കിൽ 101 ൽ ബന്ധപ്പെടുക.'
        : 'Note: EnteMLA is not an emergency portal. For accidents or medical emergencies, please contact the official helpline at 112 or 101 immediately.';
    }

    if (['helpdesk', 'support', 'contact entemla', 'help desk', 'contact support', 'contact helpdesk', 'ഹെൽപ്ഡെസ്ക്', 'സഹായം', 'ഹെൽപ്ഡെസ്ക് നമ്പർ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'സഹായത്തിന് "Contact Us" പേജ് സന്ദർശിക്കുക അല്ലെങ്കിൽ MLA ഓഫീസ് നേരിട്ട് ബന്ധപ്പെടുക.\nഓഫീസ് സമയം: തിങ്കൾ – ശനി, 10:00 AM – 5:00 PM.'
        : 'For support, visit the "Contact Us" page or contact the MLA office directly.\nOffice hours: Monday – Saturday, 10:00 AM – 5:00 PM.';
    }

    // ─────────────────────────────────────────────
    // 11. TECHNICAL ISSUES
    // ─────────────────────────────────────────────

    if (['not loading', 'slow', 'browser', 'ലോഡ് ആകുന്നില്ല', 'സ്ലോ'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ബ്രൗസർ Cache ക്ലിയർ ചെയ്യുക അല്ലെങ്കിൽ Chrome, Firefox-ന്റെ പുതിയ പതിപ്പ് ഉപയോഗിക്കുക. പ്രശ്നം തുടരുകയാണെങ്കിൽ സെർവർ അപ്ഡേറ്റ് കൊണ്ടാകാം, അൽപ്പ സമയം കഴിഞ്ഞ് ശ്രമിക്കുക.'
        : 'Clear your browser cache or try using an updated version of Chrome or Firefox. If the issue continues, it may be due to a server update — please try again after a few minutes.';
    }

    if (['upload fail', 'file fail', 'അപ്‌ലോഡ്'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'ഫയൽ അപ്‌ലോഡ് പരാജയപ്പെട്ടാൽ ഫയൽ 5MB-യിൽ താഴെ ആണെന്നും PDF, JPG, PNG ഫോർമാറ്റ് ആണെന്നും ഉറപ്പാക്കുക.'
        : 'If upload fails, make sure your file is below 5MB and is in PDF, JPG, or PNG format.';
    }

    // ─────────────────────────────────────────────
    // 12. MLA DIRECTORY LOOKUP
    // ─────────────────────────────────────────────

    const noiseWords = new Set([
      'who', 'what', 'is', 'the', 'of', 'are', 'tell', 'me', 'give', 'mla',
      'constituency', 'about', 'phone', 'number', 'contact', 'in', 'for', 'a',
    ]);
    const words = q.split(/\s+/).filter(w => w.length > 2 && !noiseWords.has(w));
    const matched = this.mlas.find(m => {
      const content = m.content.toLowerCase();
      const source = m.source.toLowerCase();
      return words.some(word => content.includes(word) || source.includes(word));
    });
    if (matched) {
      return lang === 'Malayalam'
        ? `വിവരം:\n${matched.content}`
        : matched.content;
    }

    // ─────────────────────────────────────────────
    // 13. FILING ACTION — GENERIC CATCH-ALL
    // ─────────────────────────────────────────────

    const isFilingAction = q.includes('file') || q.includes('submit') || q.includes('register a complaint') || q.includes('new') || q.includes('raise');
    const isComplaintTopic = q.includes('complaint') || q.includes('issue') || q.includes('problem') || q.includes('grievance');
    const hasMalayalamComplaint = q.includes('പരാതി നൽകാൻ');

    if ((isFilingAction && isComplaintTopic) || q.includes('grievance') || hasMalayalamComplaint) {
      return lang === 'Malayalam'
        ? 'പരാതി നൽകാൻ:\n• EnteMLA-ൽ ലോഗിൻ ചെയ്യുക\n• "New Grievance" ക്ലിക്ക് ചെയ്യുക\n• വിവരങ്ങൾ നൽകുക\n• Submit ക്ലിക്ക് ചെയ്യുക\n\nTraking ID ലഭിക്കും.'
        : 'To file a complaint:\n• Login to EnteMLA\n• Click "New Grievance"\n• Fill in the details\n• Click Submit\n\nYou will receive a Tracking ID.';
    }

    if (['track', 'status', 'tracking', 'ട്രാക്ക്', 'സ്ഥിതി'].some(w => q.includes(w))) {
      return lang === 'Malayalam'
        ? 'Tracking ID ഉപയോഗിച്ച് പരാതിയുടെ സ്ഥിതി അറിയാം.\n\n• Pending — പരിശോധന തുടങ്ങിയിട്ടില്ല\n• In Progress — പരിശോധിക്കുന്നു\n• Resolved — നടപടി എടുത്തു'
        : 'Use the Tracking ID to check complaint status.\n\n• Pending — Awaiting review\n• In Progress — Being reviewed\n• Resolved — Action taken';
    }

    // ─────────────────────────────────────────────
    // 14. FALLBACK
    // ─────────────────────────────────────────────

    return lang === 'Malayalam'
      ? 'ക്ഷമിക്കണം, ആ ചോദ്യം മനസ്സിലായില്ല. ദയവായി മറ്റൊരു രീതിയിൽ ചോദിക്കൂ.'
      : 'Sorry, I could not understand your question. Please try asking differently.';
  }
}
