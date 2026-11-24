# Generates privacy.html (public page for the store listing) and src/privacy.js (in-app page)
# from one source, so both always say the same thing. Run: python3 tools/privacy.py
import json,html
UPDATED={'ar':'٢٥ نوفمبر ٢٠٢٦','az':'25 noyabr 2026','en':'25 November 2026','tr':'25 Kasım 2026'}
CONTACT='nibrascode@gmail.com';ISSUES='https://github.com/nihomaho9-ui/fifty-hadith/issues'
P={
'ar':{'name':'العربية','dir':'rtl','title':'سياسة الخصوصية — الأربعون النووية','upd':'آخر تحديث','ver':'إصدار التطبيق','s':[
 ('باختصار','تطبيق «الأربعون النووية وزيادات ابن رجب» من Nibras Code لا يجمع أي بيانات شخصية، ولا يتصل بالإنترنت، ولا يطلب أي إذن. لا حسابات ولا إعلانات ولا أدوات تحليل أو تتبّع.'),
 ('البيانات التي لا نجمعها','لا نجمع اسمك ولا بريدك ولا موقعك ولا معرّفات جهازك ولا سجل قراءتك ولا أي بيانات استخدام، ولا نبيعها ولا نشاركها مع أحد. لا يحتوي التطبيق على أي مكتبة إعلانات أو تحليلات.'),
 ('ما يُحفظ على جهازك فقط','الأحاديث المحفوظة، وآخر حديث قرأته، وحجم الخط، والمظهر، وسرعة القراءة الصوتية: تُحفظ في ذاكرة التطبيق على جهازك فقط ولا تغادره. يمكنك مسحها من «الإعدادات» أو بمسح بيانات التطبيق أو حذفه.'),
 ('الإنترنت والأذونات','تطبيق أندرويد لا يطلب أي إذن، ولا حتى إذن الإنترنت. كل النصوص والخطوط داخل التطبيق، فهو يعمل دون اتصال كليًّا.'),
 ('الاستماع (تحويل النص إلى كلام)','زر «استماع» يستخدم محرك تحويل النص إلى كلام المثبّت على جهازك. يُمرَّر نص الحديث إلى ذلك المحرك على الجهاز نفسه ليقرأه، ولا يرسله التطبيق إلى أي خادم. المحرك من إعدادات جهازك وتسري عليه سياسة الشركة المصنّعة له.'),
 ('النسخ والمشاركة','عند النسخ يوضع النص في حافظة جهازك. وعند المشاركة يُرسل النص إلى التطبيق الذي تختاره أنت فقط.'),
 ('النسخة على الويب','عند فتح النسخة المستضافة على GitHub Pages قد تسجّل GitHub بيانات تقنية عادية للطلبات (مثل عنوان IP) وفق سياستها. والتطبيق نفسه لا يضيف أي تتبّع.'),
 ('الأطفال','التطبيق مناسب لجميع الأعمار ولا يجمع بيانات من أحد، صغيرًا كان أو كبيرًا.'),
 ('التغييرات','إذا تغيّرت هذه السياسة نحدّث التاريخ أعلاه وننشر النص الجديد في هذه الصفحة.'),
 ('التواصل','للأسئلة: <a href="mailto:%s">%s</a>، أو <a href="%s">%s</a>.'%(CONTACT,CONTACT,ISSUES,ISSUES))]},
'az':{'name':'Azərbaycanca','dir':'ltr','title':'Məxfilik siyasəti — Ərbəin Nəvəvi','upd':'Son yenilənmə','ver':'Tətbiq versiyası','s':[
 ('Qısa məzmun','Nibras Code-un «الأربعون النووية وزيادات ابن رجب» (Ərbəin Nəvəvi) tətbiqi heç bir şəxsi məlumat toplamır, internetə qoşulmur və heç bir icazə istəmir. Hesab, reklam, analitika və izləmə yoxdur.'),
 ('Toplamadığımız məlumatlar','Adınızı, e-poçtunuzu, yerinizi, cihaz identifikatorlarını, oxu tarixçənizi və ya istifadə məlumatlarını toplamırıq, satmırıq və heç kimlə paylaşmırıq. Tətbiqdə reklam və analitika kitabxanası yoxdur.'),
 ('Yalnız cihazınızda saxlananlar','Yadda saxlanan hədislər, son oxunan hədis, şrift ölçüsü, görünüş və səsli oxu sürəti yalnız cihazınızda, tətbiqin öz yaddaşında qalır və cihazdan çıxmır. Onları «Ayarlar»dan, tətbiqin məlumatlarını silməklə və ya tətbiqi silməklə təmizləyə bilərsiniz.'),
 ('İnternet və icazələr','Android tətbiqi heç bir icazə istəmir, hətta internet icazəsi də yoxdur. Bütün mətnlər və şriftlər tətbiqin içindədir, tam internetsiz işləyir.'),
 ('Dinləmə (mətnin səsləndirilməsi)','«Dinlə» düyməsi cihazınızda quraşdırılmış mətni səsləndirmə (TTS) mühərrikindən istifadə edir. Hədisin mətni oxunmaq üçün həmin mühərrikə cihazın özündə ötürülür; tətbiq onu heç bir serverə göndərmir. Mühərrik cihazınızın ayarlarındandır və onun istehsalçısının siyasətinə tabedir.'),
 ('Kopyalama və paylaşma','Kopyalayanda mətn cihazınızın mübadilə buferinə düşür. Paylaşanda mətn yalnız sizin seçdiyiniz tətbiqə göndərilir.'),
 ('Veb versiya','GitHub Pages-də yerləşən veb versiyanı açanda GitHub öz siyasətinə uyğun olaraq adi texniki sorğu məlumatlarını (məs. IP ünvanı) qeydə ala bilər. Tətbiqin özü heç bir izləmə əlavə etmir.'),
 ('Uşaqlar','Tətbiq bütün yaşlar üçün uyğundur və heç kimdən, uşaq və ya böyük, məlumat toplamır.'),
 ('Dəyişikliklər','Siyasət dəyişsə, yuxarıdakı tarixi yeniləyib yeni mətni bu səhifədə dərc edəcəyik.'),
 ('Əlaqə','Suallar üçün: <a href="mailto:%s">%s</a>, və ya <a href="%s">%s</a>.'%(CONTACT,CONTACT,ISSUES,ISSUES))]},
'en':{'name':'English','dir':'ltr','title':'Privacy policy — Arbaun Nawawi','upd':'Last updated','ver':'App version','s':[
 ('Summary','The app “Al-Arbaʿun an-Nawawiyya with Ibn Rajab’s additions” (Arbaun Nawawi) by Nibras Code collects no personal data, does not connect to the internet and asks for no permissions. No accounts, no ads, no analytics, no tracking.'),
 ('Data we do not collect','We do not collect your name, email, location, device identifiers, reading history or any usage data, and we do not sell or share anything with anyone. The app contains no advertising or analytics libraries.'),
 ('Stored only on your device','Saved hadith, the last hadith you read, text size, theme and speech rate are kept only in the app’s own storage on your device and never leave it. You can clear them in Settings, by clearing the app’s data, or by uninstalling the app.'),
 ('Internet and permissions','The Android app requests no permissions, not even internet access. All texts and fonts are inside the app, so it works fully offline.'),
 ('Listening (text-to-speech)','The “Listen” button uses the text-to-speech engine installed on your device. The hadith text is passed to that engine on the device itself to be read aloud; the app does not send it to any server. The engine comes from your device settings and is covered by its maker’s policy.'),
 ('Copy and share','Copying puts the text on your device’s clipboard. Sharing sends the text only to the app you choose.'),
 ('Web version','When you open the web version hosted on GitHub Pages, GitHub may log normal technical request data (such as IP address) under its own policy. The app itself adds no tracking.'),
 ('Children','The app is suitable for all ages and collects no data from anyone, child or adult.'),
 ('Changes','If this policy changes, we will update the date above and publish the new text on this page.'),
 ('Contact','Questions: <a href="mailto:%s">%s</a>, or <a href="%s">%s</a>.'%(CONTACT,CONTACT,ISSUES,ISSUES))]},
'tr':{'name':'Türkçe','dir':'ltr','title':'Gizlilik politikası — Kırk Hadis – Nevevî','upd':'Son güncelleme','ver':'Uygulama sürümü','s':[
 ('Özet','Nibras Code’un «الأربعون النووية وزيادات ابن رجب» (Kırk Hadis – Nevevî) uygulaması hiçbir kişisel veri toplamaz, internete bağlanmaz ve hiçbir izin istemez. Hesap, reklam, analiz ve takip yoktur.'),
 ('Toplamadığımız veriler','Adınızı, e-postanızı, konumunuzu, cihaz kimliklerinizi, okuma geçmişinizi veya kullanım verilerinizi toplamayız; hiçbir şeyi satmaz ve kimseyle paylaşmayız. Uygulamada reklam veya analiz kütüphanesi yoktur.'),
 ('Yalnızca cihazınızda saklananlar','Kaydedilen hadisler, son okunan hadis, yazı boyutu, tema ve sesli okuma hızı yalnızca cihazınızda, uygulamanın kendi belleğinde tutulur ve cihazdan çıkmaz. Bunları Ayarlar’dan, uygulama verilerini silerek veya uygulamayı kaldırarak temizleyebilirsiniz.'),
 ('İnternet ve izinler','Android uygulaması hiçbir izin istemez, internet izni bile yoktur. Tüm metinler ve yazı tipleri uygulamanın içindedir; tamamen internetsiz çalışır.'),
 ('Dinleme (metin okuma)','«Dinle» düğmesi cihazınızda yüklü metin okuma (TTS) motorunu kullanır. Hadis metni sesli okunmak üzere bu motora cihazın kendi içinde aktarılır; uygulama onu hiçbir sunucuya göndermez. Motor cihaz ayarlarınızdandır ve üreticisinin politikasına tabidir.'),
 ('Kopyalama ve paylaşma','Kopyaladığınızda metin cihazınızın panosuna alınır. Paylaştığınızda metin yalnızca seçtiğiniz uygulamaya gönderilir.'),
 ('Web sürümü','GitHub Pages’te barındırılan web sürümünü açtığınızda GitHub, kendi politikasına göre olağan teknik istek verilerini (ör. IP adresi) kaydedebilir. Uygulamanın kendisi hiçbir takip eklemez.'),
 ('Çocuklar','Uygulama her yaşa uygundur ve çocuk ya da yetişkin hiç kimseden veri toplamaz.'),
 ('Değişiklikler','Politika değişirse yukarıdaki tarihi güncelleyip yeni metni bu sayfada yayımlarız.'),
 ('İletişim','Sorular için: <a href="mailto:%s">%s</a> veya <a href="%s">%s</a>.'%(CONTACT,CONTACT,ISSUES,ISSUES))]}}
VER='1.0.1'
def body(l):
  d=P[l];out='<h1>%s</h1><p class="updated">%s: %s · %s %s</p>'%(html.escape(d['title']),d['upd'],UPDATED[l],d['ver'],VER)
  for i,(h,t) in enumerate(d['s'],1): out+='<section><h2>%d. %s</h2><p>%s</p></section>'%(i,html.escape(h),t)
  return out
# in-app data
js={l:{'name':P[l]['name'],'dir':P[l]['dir'],'html':body(l)} for l in P}
open('src/privacy.js','w').write('window.PRIVACY_DATA='+json.dumps(js,ensure_ascii=False)+';\n')
# public page
langs=''.join('<a href="#%s" lang="%s">%s</a>'%(l,l,P[l]['name']) for l in P)
secs=''.join('<article id="%s" lang="%s" dir="%s">%s</article>'%(l,l,P[l]['dir'],body(l)) for l in P)
page='''<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>سياسة الخصوصية — الأربعون النووية · Privacy policy</title>
<link rel="icon" href="icons/favicon-32.png" type="image/png">
<style>
@font-face{font-family:"NKufi";src:url("fonts/NotoKufiArabic-UI.woff2") format("woff2");font-weight:100 900}
:root{--ink:#17211f;--mut:#5d6b67;--line:#dfe8e5;--bg:#f5f8f7;--card:#fff;--green:#1f6b52;--head:#1d4f7a}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.75 system-ui,"Segoe UI",Roboto,sans-serif}
.top{background:linear-gradient(135deg,#1d4f7a,#1f7a5a);color:#fff;padding:14px 18px;display:flex;align-items:center;gap:12px}
.top img{width:44px;height:44px;border-radius:10px}.top b{font-family:"NKufi",sans-serif;font-size:18px}
.wrap{max-width:780px;margin:0 auto;padding:16px 16px 40px}
nav{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 16px}nav a{padding:4px 14px;border:1px solid var(--line);border-radius:999px;background:var(--card);color:var(--green);text-decoration:none}
article{margin:0 0 34px}article[dir=rtl]{font-family:"NKufi","Noto Kufi Arabic",Tahoma,sans-serif}
h1{font-size:1.45rem;line-height:1.35;margin:.4rem 0 .3rem;color:var(--head)}.updated{color:var(--mut);margin:0 0 12px;font-size:.95rem}
section{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px 16px;margin:0 0 10px}
h2{font-size:1.02rem;margin:0 0 4px;color:var(--green)}p{margin:0}a{color:var(--green)}
footer{color:var(--mut);font-size:.9rem;border-top:1px solid var(--line);padding-top:12px}
</style></head><body>
<div class="top"><img src="icons/icon-96.png" alt=""><b>الأربعون النووية وزيادات ابن رجب</b></div>
<div class="wrap"><nav>'''+langs+'</nav>'+secs+'<footer dir="ltr">Nibras Code · <a href="mailto:'+CONTACT+'">'+CONTACT+'</a> · <a href="./">الأربعون النووية</a></footer></div></body></html>\n'
open('privacy.html','w').write(page);print('ok',len(page))
