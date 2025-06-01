<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Password Recovery</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background-color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #213567;
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #213567;
            margin-top: 0;
            font-size: 20px;
        }
        .reset-button {
            display: inline-block;
            background-color: #213567;
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            margin: 25px 0;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }
        .reset-button:hover {
            background-color: #1a2b52;
        }
        .reset-link {
            word-break: break-all;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #213567;
            margin: 20px 0;
            font-family: monospace;
            font-size: 14px;
        }
        .warning-box {
            background-color: #fff8e1;
            border: 1px solid #ffc107;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .warning-box h3 {
            color: #856404;
            margin-top: 0;
            font-size: 16px;
        }
        .warning-box ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .warning-box li {
            margin-bottom: 8px;
            color: #856404;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 25px 30px;
            border-top: 1px solid #e9ecef;
            font-size: 14px;
            color: #6c757d;
            text-align: center;
        }
        .footer p {
            margin: 5px 0;
        }
        .app-name {
            color: #213567;
            font-weight: 600;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .content {
                padding: 30px 20px;
            }
            .reset-button {
                display: block;
                text-align: center;
                margin: 25px 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🔐 Password Reset Request</h1>
        </div>
        
        <div class="content">
            <h2>Hello there!</h2>
            
            <p>We received a request to reset the password for your account associated with <strong>{{ $email }}</strong>.</p>
            
            <p>If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
                <a href="{{ $resetUrl }}" class="reset-button">🔓 Reset My Password</a>
            </div>
            
            <p><strong>Alternative:</strong> If the button doesn't work, copy and paste this link into your browser:</p>
            <div class="reset-link">
                {{ $resetUrl }}
            </div>
            
            <div class="warning-box">
                <h3>⚠️ Important Security Information</h3>
                <ul>
                    <li><strong>This link expires in 60 minutes</strong> for your security</li>
                    <li>If you didn't request this password reset, please ignore this email</li>
                    <li>Your current password will remain active until you create a new one</li>
                    <li>Never share this reset link with anyone</li>
                </ul>
            </div>
            
            <p>If you're having trouble with the reset process or have any questions, please don't hesitate to contact our support team.</p>
        </div>
        
        <div class="footer">
            <p>This email was sent because a password reset was requested for your account.</p>
            <p>If you didn't make this request, you can safely ignore this email.</p>
            <p><strong class="app-name">{{ config('app.name', 'Your App') }} Team</strong></p>
            <p style="margin-top: 15px; font-size: 12px;">
                © {{ date('Y') }} {{ config('app.name', 'Your App') }}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>