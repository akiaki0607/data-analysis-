import { NextResponse } from "next/server";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  phone: z.string().regex(/^1[3-9]\d{9}$/),
  email: z.string().email(),
  message: z.string().min(10),
});

// Dynamically import Resend to avoid bundling issues
let resendInstance: any = null;

async function getResendInstance() {
  if (!process.env.RESEND_API_KEY) return null;
  
  if (!resendInstance) {
    const { Resend } = await import("resend");
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  
  return resendInstance;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = contactFormSchema.parse(body);

    // Log submission
    console.log("Contact form submission:", validatedData);

    // Send email notification using Resend
    const resend = await getResendInstance();
    if (resend && process.env.CONTACT_EMAIL) {
      try {
        await resend.emails.send({
          from: "移山科技 <contact@geokeji.com>",
          to: process.env.CONTACT_EMAIL,
          replyTo: validatedData.email,
          subject: `新的咨询 - ${validatedData.company}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
                  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                  .field { margin-bottom: 20px; }
                  .label { font-weight: 600; color: #4b5563; margin-bottom: 5px; }
                  .value { color: #1f2937; padding: 10px; background: white; border-radius: 5px; }
                  .footer { text-align: center; color: #9ca3af; margin-top: 30px; font-size: 14px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0; font-size: 24px;">🎉 新的客户咨询</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">来自官网联系表单</p>
                  </div>
                  <div class="content">
                    <div class="field">
                      <div class="label">👤 客户姓名</div>
                      <div class="value">${validatedData.name}</div>
                    </div>
                    <div class="field">
                      <div class="label">🏢 公司名称</div>
                      <div class="value">${validatedData.company}</div>
                    </div>
                    <div class="field">
                      <div class="label">📱 手机号码</div>
                      <div class="value">${validatedData.phone}</div>
                    </div>
                    <div class="field">
                      <div class="label">📧 电子邮箱</div>
                      <div class="value"><a href="mailto:${validatedData.email}">${validatedData.email}</a></div>
                    </div>
                    <div class="field">
                      <div class="label">💬 需求描述</div>
                      <div class="value">${validatedData.message.replace(/\n/g, "<br>")}</div>
                    </div>
                  </div>
                  <div class="footer">
                    <p>此邮件由移山科技官网自动发送</p>
                    <p>请及时跟进客户需求</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        console.log("Email sent successfully");
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.warn("Email not configured. Set RESEND_API_KEY and CONTACT_EMAIL in environment variables.");
    }

    // Return success response
    return NextResponse.json(
      { 
        message: "提交成功，我们将尽快与您联系", 
        success: true 
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "数据验证失败", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}

