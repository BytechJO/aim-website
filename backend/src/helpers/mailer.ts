import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const smtpHost = process.env.SMTP_HOST || "smtp-relay.brevo.com";
const smtpPort = Number(process.env.SMTP_PORT || 587);

function createMailerTransporter() {
  const mailOptions: SMTPTransport.Options = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  };

  return nodemailer.createTransport(mailOptions);
}

const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

export async function sendNewsletterConfirmationEmail(
  email: string,
  code: string,
  locale: string = "en",
) {
  const isArabic = locale === "ar";

  const logoUrl =
    process.env.BRAND_LOGO_URL ||
    "https://res.cloudinary.com/dm9thlgrs/image/upload/v1782294415/aim/kihg9o64da8vevuttpoc.svg";

  const websiteUrl = "https://aim-website-seven.vercel.app/";

  const subject = isArabic
    ? "كود تأكيد الاشتراك بالنشرة البريدية"
    : "Your newsletter confirmation code";

  const previewText = isArabic
    ? `كود تأكيد اشتراكك هو ${code}`
    : `Your confirmation code is ${code}`;

  console.log("Before sendMail:", email);

  const transporter = createMailerTransporter();

  await transporter.sendMail({
    from: `"AIM Printing" <${fromEmail}>`,
    to: email,
    subject,
    html: `
<!DOCTYPE html>
<html lang="${isArabic ? "ar" : "en"}" dir="${isArabic ? "rtl" : "ltr"}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
  </head>

  <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
      ${previewText}
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4; padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; background:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
            
            <tr>
              <td style="background:linear-gradient(90deg,#F8E586 0%,#EE8461 100%); padding:28px 32px; text-align:center;">
                <a href="${websiteUrl}" target="_blank" style="text-decoration:none;">
                  <img 
                    src="${logoUrl}" 
                    alt="AIM Printing" 
                    width="150" 
                    style="display:block; margin:0 auto; max-width:150px; height:auto;" 
                  />
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:36px 34px 12px; text-align:${isArabic ? "right" : "left"};">
                <h1 style="margin:0; color:#111111; font-size:28px; line-height:1.25; font-weight:700;">
                  ${isArabic ? "تأكيد الاشتراك" : "Confirm your subscription"}
                </h1>

                <p style="margin:16px 0 0; color:#555555; font-size:15px; line-height:1.8;">
                  ${
                    isArabic
                      ? "شكرًا لاشتراكك في النشرة البريدية الخاصة بنا. استخدم الكود التالي لتأكيد اشتراكك والبدء باستقبال آخر أخبارنا وتحديثاتنا."
                      : "Thank you for subscribing to our newsletter. Use the code below to confirm your subscription and start receiving our latest news and updates."
                  }
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:22px 34px;">
                <div style="
                  display:inline-block;
                  background:#111111;
                  color:#ffffff;
                  border-radius:18px;
                  padding:18px 30px;
                  font-size:34px;
                  font-weight:800;
                  letter-spacing:8px;
                  line-height:1;
                  direction:ltr;
                  text-align:center;
                ">
                  ${code}
                </div>

                <p style="margin:14px 0 0; color:#888888; font-size:13px; line-height:1.6; text-align:center;">
                  ${
                    isArabic
                      ? "هذا الكود صالح للاستخدام مرة واحدة فقط."
                      : "This code can be used once only."
                  }
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:4px 34px 34px; text-align:${isArabic ? "right" : "left"};">
                <div style="background:#f7f7f7; border-radius:16px; padding:18px 20px;">
                  <p style="margin:0; color:#666666; font-size:14px; line-height:1.7;">
                    ${
                      isArabic
                        ? "إذا لم تطلب هذا الاشتراك، يمكنك تجاهل هذه الرسالة بأمان."
                        : "If you did not request this subscription, you can safely ignore this email."
                    }
                  </p>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:22px 34px; background:#111111; text-align:center;">
                <p style="margin:0; color:#ffffff; font-size:13px; line-height:1.7;">
                  ${
                    isArabic
                      ? "AIM Printing — آخر الأخبار والتحديثات مباشرة إلى بريدك."
                      : "AIM Printing — Latest news and updates delivered to your inbox."
                  }
                </p>

                <a 
                  href="${websiteUrl}" 
                  target="_blank" 
                  style="display:inline-block; margin-top:10px; color:#F8E586; font-size:13px; text-decoration:underline;"
                >
                  ${isArabic ? "زيارة الموقع" : "Visit website"}
                </a>
              </td>
            </tr>

          </table>

          <p style="margin:18px 0 0; color:#999999; font-size:12px; text-align:center; line-height:1.6;">
            ${
              isArabic
                ? "تم إرسال هذه الرسالة لأنك طلبت الاشتراك في النشرة البريدية."
                : "You received this email because you requested to subscribe to our newsletter."
            }
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
    text: isArabic
      ? `كود تأكيد الاشتراك هو: ${code}`
      : `Your newsletter confirmation code is: ${code}`,
  });

  console.log("After sendMail:", email);
}

export async function sendNewsPublishedEmail({
  to,
  locale,
  title,
  description,
  image,
  url,
}: {
  to: string;
  locale: string;
  title: string;
  description: string;
  image?: string | null;
  url: string;
}) {
  const isArabic = locale === "ar";

  const subject = isArabic
    ? `خبر جديد من AIM: ${title}`
    : `New from AIM: ${title}`;

  const transporter = createMailerTransporter();

  await transporter.sendMail({
    from: `"AIM Printing" <${fromEmail}>`,
    to,
    subject,
    html: `
<!DOCTYPE html>
<html lang="${isArabic ? "ar" : "en"}" dir="${isArabic ? "rtl" : "ltr"}">
  <body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f4; padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background:#ffffff; border-radius:20px; overflow:hidden;">
            
            ${
              image
                ? `
            <tr>
              <td>
                <img 
                  src="${image}" 
                  alt="${title}" 
                  width="600"
                  style="display:block; width:100%; max-width:600px; height:auto; border:0;"
                />
              </td>
            </tr>
                `
                : ""
            }

            <tr>
              <td style="padding:34px 34px 16px; text-align:${isArabic ? "right" : "left"};">
                <p style="margin:0 0 10px; color:#EE8461; font-size:13px; font-weight:bold; letter-spacing:0.5px;">
                  ${isArabic ? "خبر جديد" : "NEW ARTICLE"}
                </p>

                <h1 style="margin:0; color:#111111; font-size:28px; line-height:1.3; font-weight:800;">
                  ${title}
                </h1>

                <p style="margin:18px 0 0; color:#666666; font-size:15px; line-height:1.8;">
                  ${description || ""}
                </p>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:20px 34px 38px;">
                <a 
                  href="${url}" 
                  target="_blank"
                  style="
                    display:inline-block;
                    background:#111111;
                    color:#ffffff;
                    text-decoration:none;
                    padding:15px 28px;
                    border-radius:999px;
                    font-size:14px;
                    font-weight:bold;
                  "
                >
                  ${isArabic ? "قراءة الخبر" : "Read the article"}
                </a>
              </td>
            </tr>

            <tr>
              <td style="background:#111111; padding:22px 34px; text-align:center;">
                <p style="margin:0; color:#ffffff; font-size:13px; line-height:1.7;">
                  ${
                    isArabic
                      ? "AIM Printing — آخر الأخبار والتحديثات مباشرة إلى بريدك."
                      : "AIM Printing — Latest news and updates delivered to your inbox."
                  }
                </p>
              </td>
            </tr>

          </table>

          <p style="margin:18px 0 0; color:#999999; font-size:12px; text-align:center; line-height:1.6;">
            ${
              isArabic
                ? "وصلتك هذه الرسالة لأنك مشترك في النشرة البريدية."
                : "You received this email because you subscribed to our newsletter."
            }
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
    text: `${title}\n\n${description || ""}\n\n${url}`,
  });
}
