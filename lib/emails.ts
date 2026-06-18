const BASE_URL = "https://www.lenslab.nl";

const LOGO_SVG = `
  <table cellpadding="0" cellspacing="0" style="background:#0f0f0f;width:100%;border-radius:12px 12px 0 0;">
    <tr><td style="padding:24px 32px;">
      <span style="font-family:sans-serif;font-size:20px;font-weight:500;color:#ffffff;letter-spacing:-0.02em;">
        Lens<span style="color:#ff5c1a;">.</span>Lab
      </span>
    </td></tr>
  </table>`;

export function welcomeEmailHtml(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:sans-serif;">
  <table cellpadding="0" cellspacing="0" style="width:100%;padding:32px 16px;">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;border-radius:12px;overflow:hidden;border:0.5px solid #e0ddd8;">
        ${LOGO_SVG}
        <tr><td style="background:#ffffff;padding:32px;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:500;letter-spacing:0.06em;color:#3b6d11;background:#eaf3de;display:inline-block;padding:3px 10px;border-radius:100px;">Je account is aangemaakt</p>
          <h1 style="margin:16px 0 8px;font-size:22px;font-weight:500;color:#0f0f0f;line-height:1.3;">Welkom bij LensLab, ${firstName}!</h1>
          <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.65;">Leuk dat je erbij bent. LensLab is het platform waar opdrachtgevers fotografen en videografen vinden voor hun projecten. Je profiel is aangemaakt en klaar om in te vullen.</p>
          <p style="margin:0 0 12px;font-size:15px;color:#444;line-height:1.65;">Zodra je het onderstaande hebt ingevuld, zetten we je profiel automatisch live:</p>
          <table cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px;">
            <tr><td style="padding:6px 0;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:26px;height:26px;border-radius:50%;background:#f3f1ec;text-align:center;vertical-align:middle;font-size:11px;font-weight:500;color:#666;">1</td>
                <td style="padding-left:12px;font-size:14px;color:#333;"><strong style="font-weight:500;color:#1a1a1a;">Bedrijfsnaam</strong> &rarr; hoe opdrachtgevers jou zien</td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:6px 0;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:26px;height:26px;border-radius:50%;background:#f3f1ec;text-align:center;vertical-align:middle;font-size:11px;font-weight:500;color:#666;">2</td>
                <td style="padding-left:12px;font-size:14px;color:#333;"><strong style="font-weight:500;color:#1a1a1a;">Minimaal 1 categorie</strong> &rarr; bijv. bruiloften, portret of zakelijk</td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:6px 0;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:26px;height:26px;border-radius:50%;background:#f3f1ec;text-align:center;vertical-align:middle;font-size:11px;font-weight:500;color:#666;">3</td>
                <td style="padding-left:12px;font-size:14px;color:#333;"><strong style="font-weight:500;color:#1a1a1a;">Minimaal 1 werkgebied</strong> &rarr; provincie of regio</td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:6px 0;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:26px;height:26px;border-radius:50%;background:#f3f1ec;text-align:center;vertical-align:middle;font-size:11px;font-weight:500;color:#666;">4</td>
                <td style="padding-left:12px;font-size:14px;color:#333;"><strong style="font-weight:500;color:#1a1a1a;">Minimaal 1 foto</strong> &rarr; je eerste foto wordt automatisch je Hero afbeelding, dit kun je later naar wens aanpassen</td>
              </tr></table>
            </td></tr>
          </table>
          <a href="${BASE_URL}/dashboard" style="display:inline-block;background:#0f0f0f;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:100px;font-size:14px;font-weight:500;">Vul je profiel in &rarr;</a>
          <hr style="border:none;border-top:0.5px solid #ece9e4;margin:24px 0;">
          <p style="margin:0 0 8px;font-size:15px;color:#444;line-height:1.65;">Vragen? Stuur een mail naar <a href="mailto:hello@lenslab.nl" style="color:#0f0f0f;">hello@lenslab.nl</a>, we helpen je graag verder.</p>
          <p style="margin:0;font-size:13px;color:#888;">Het LensLab team</p>
        </td></tr>
        <tr><td style="background:#ffffff;padding:16px 32px 24px;border-top:0.5px solid #ece9e4;">
          <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">Je ontvangt deze mail omdat je je hebt aangemeld op lenslab.nl.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function onboardingReminderEmailHtml(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:sans-serif;">
  <table cellpadding="0" cellspacing="0" style="width:100%;padding:32px 16px;">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;border-radius:12px;overflow:hidden;border:0.5px solid #e0ddd8;">
        ${LOGO_SVG}
        <tr><td style="background:#ffffff;padding:32px;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:500;letter-spacing:0.06em;color:#854f0b;background:#faeeda;display:inline-block;padding:3px 10px;border-radius:100px;">Je profiel staat nog niet live</p>
          <h1 style="margin:16px 0 8px;font-size:22px;font-weight:500;color:#0f0f0f;line-height:1.3;">Bijna daar, ${firstName}!</h1>
          <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.65;">Je hebt een paar dagen geleden een profiel aangemaakt op LensLab. Maar opdrachtgevers kunnen je nog niet vinden omdat er nog geen foto's in je portfolio staan.</p>
          <p style="margin:0 0 24px;font-size:15px;color:#444;line-height:1.65;">Beeldmakers met minimaal 5 foto's in hun portfolio krijgen gemiddeld 3x meer profielbezoeken. Het toevoegen van je eerste foto duurt minder dan een minuut.</p>
          <a href="${BASE_URL}/dashboard" style="display:inline-block;background:#0f0f0f;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:100px;font-size:14px;font-weight:500;">Voeg je eerste foto toe &rarr;</a>
          <hr style="border:none;border-top:0.5px solid #ece9e4;margin:24px 0;">
          <p style="margin:0 0 8px;font-size:15px;color:#444;line-height:1.65;">Lukt het niet of heb je een vraag? Stuur even een mail naar <a href="mailto:hello@lenslab.nl" style="color:#0f0f0f;">hello@lenslab.nl</a>, we helpen je direct verder.</p>
          <p style="margin:0;font-size:13px;color:#888;">Het LensLab team</p>
        </td></tr>
        <tr><td style="background:#ffffff;padding:16px 32px 24px;border-top:0.5px solid #ece9e4;">
          <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">Je ontvangt deze mail omdat je een profiel hebt op lenslab.nl.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
