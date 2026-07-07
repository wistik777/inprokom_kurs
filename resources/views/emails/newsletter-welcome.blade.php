<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Подписка на новости</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#181818;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr>
        <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);">
                <tr>
                    <td style="background:#FA4234;padding:28px 32px;">
                        <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.85);">НПП «Инпроком»</p>
                        <h1 style="margin:12px 0 0;font-size:24px;line-height:1.3;color:#ffffff;font-weight:700;">
                            Спасибо за подписку!
                        </h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:32px;">
                        <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#333333;">
                            Вы успешно подписались на рассылку новостей компании «Инпроком».
                            Мы будем присылать актуальные материалы пресс-центра, анонсы продукции и важные события компании.
                        </p>
                        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#555555;">
                            Пока ждёте новые публикации — ознакомьтесь с каталогом оборудования или последними новостями на сайте.
                        </p>
                        <table role="presentation" cellspacing="0" cellpadding="0">
                            <tr>
                                <td style="padding-right:12px;">
                                    <a href="{{ $siteUrl }}/press-center/news"
                                       style="display:inline-block;padding:14px 22px;background:#FA4234;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;border-radius:6px;">
                                        Читать новости
                                    </a>
                                </td>
                                <td>
                                    <a href="{{ $siteUrl }}/catalog"
                                       style="display:inline-block;padding:14px 22px;background:#ffffff;color:#FA4234;text-decoration:none;font-size:14px;font-weight:700;border-radius:6px;border:2px solid #FA4234;">
                                        Каталог
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 32px;background:#fafafa;border-top:1px solid #ececec;">
                        <p style="margin:0;font-size:12px;line-height:1.5;color:#888888;">
                            НПП «Инпроком» · {{ config('mail.reply_to.address', 'info@inprokom.ru') }} · 8 49244 7 75 34<br>
                            <a href="{{ $siteUrl }}" style="color:#FA4234;text-decoration:none;">{{ $siteUrl }}</a>
                        </p>
                        <p style="margin:12px 0 0;font-size:11px;line-height:1.5;color:#aaaaaa;">
                            Чтобы отписаться, ответьте на это письмо с темой «Отписка от рассылки».
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
