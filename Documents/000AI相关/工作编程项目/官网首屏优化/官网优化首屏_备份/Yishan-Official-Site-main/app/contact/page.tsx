"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Mail, Phone, MapPin, Send, Sparkles, CheckCircle2, QrCode, Zap } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "姓名至少2个字符"),
  company: z.string().min(2, "公司名称至少2个字符"),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, "请输入有效的手机号码"),
  // email: z.string().email("请输入有效的邮箱地址"),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const scrollToForm = () => {
    const formSection = document.getElementById('contact-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 检测URL参数，自动滚动到表单区
  useEffect(() => {
    const fromCta = searchParams.get('from');
    if (fromCta === 'cta') {
      // 延迟执行以确保DOM已完全渲染
      setTimeout(() => {
        scrollToForm();
      }, 100);
    }
  }, [searchParams]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const requestData = {
        name: data.name,
        companyName: data.company,
        phone: data.phone,
        demand: data.message || "",
        source: "移山科技官网"
      };

      const response = await fetch("https://api.wanhuchangan.com/geoWebsite/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert("提交失败，请稍后重试");
      }
    } catch (error) {
      console.error("提交失败:", error);
      alert("提交失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <Section className="bg-transparent">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <button 
              onClick={scrollToForm}
              className="inline-flex items-center space-x-2 bg-[#635BFF]/10 border border-[#635BFF]/20 rounded-full px-4 py-2 mb-6 cursor-pointer hover:bg-[#635BFF]/20 hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="text-[#635BFF]" size={18} />
              <span className="text-sm text-gray-900">联系我们</span>
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              开启您的GEO增长之旅
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              填写联系方式，我们的GEO专家将在2小时内与您联系
              <br />
              为您提供免费的GEO现状诊断和优化建议
            </p>
          </div>
        </Container>
      </Section>

      {/* Contact Form Section */}
      <Section id="contact-form" className="bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <Card glass>
                {isSuccess ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="text-[#635BFF] mx-auto mb-4" size={64} />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      提交成功！
                    </h3>
                    <p className="text-gray-600">
                      我们已收到您的咨询，专家将在2小时内与您联系
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      免费咨询表单
                    </h2>
                    
                    {/* 限时优惠提示 */}
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-[#635BFF]/20 border border-[#635BFF]/40 rounded-lg shadow-lg">
                      <div className="flex items-center justify-center gap-2">
                        <Sparkles className="text-[#635BFF]" size={20} />
                        <p className="text-gray-900 font-bold text-center text-base sm:text-lg">
                          限前100位客户享免费GEO诊断服务
                        </p>
                        <Sparkles className="text-[#635BFF]" size={20} />
                      </div>
                    </div>

                    {/* 醒目二维码卡片 - 快速联系入口（轻蓝紫纯色，无渐变） */}
                    <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-indigo-50 dark:bg-indigo-950/30 ring-1 ring-indigo-200/60 dark:ring-indigo-800/60 rounded-xl sm:rounded-2xl backdrop-blur-sm shadow-lg">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                        <div className="flex-1 text-center md:text-left">
                          <div className="flex items-center justify-center md:justify-start gap-2 mb-2 sm:mb-3">
                            <Zap className="text-[#635BFF]" size={20} />
                            <h3 className="text-base sm:text-lg font-bold text-gray-900">
                              急需咨询？扫码直达专属顾问
                            </h3>
                          </div>
                          <p className="text-gray-900 text-xs sm:text-sm mb-2">
                            企业微信 · 2分钟响应 · 1对1服务
                          </p>
                          <p className="text-gray-900 text-xs sm:text-sm">
                            👇 或填写下方表单，我们将在2小时内回电
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-xl">
                            <img
                              src="/sales-wechat-qrcode.png"
                              alt="企业微信二维码"
                              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
                            />
                          </div>
                          <p className="text-center text-gray-900 text-xs font-medium mt-2">
                            扫码立即咨询
                          </p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          您的姓名 <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("name")}
                          type="text"
                          placeholder="请输入您的姓名"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/20 transition-colors"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Company */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          公司名称 <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("company")}
                          type="text"
                          placeholder="请输入公司名称"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/20 transition-colors"
                        />
                        {errors.company && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.company.message}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          手机号码 <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("phone")}
                          type="tel"
                          placeholder="请输入手机号码"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/20 transition-colors"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      {/* Email - 已注释，保留代码以备后用 */}
                      {/* 
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          电子邮箱 <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="请输入电子邮箱"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#635BFF] transition-colors"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div> 
                      */}

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          需求描述
                        </label>
                        <textarea
                          {...register("message")}
                          rows={2}
                          placeholder="请描述您的需求和期望"
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/20 transition-colors resize-none"
                        />
                        {errors.message && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.message.message}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isSubmitting}
                        className="w-full group"
                      >
                        {isSubmitting ? (
                          "提交中..."
                        ) : (
                          <>
                            立即提交
                            <Send
                              className="ml-2 group-hover:translate-x-1 transition-transform"
                              size={18}
                            />
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        提交即表示您同意我们的隐私政策和服务条款
                      </p>
                    </form>
                  </>
                )}
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  联系方式
                </h2>
                <div className="space-y-6">
                  <Card glass>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-[#635BFF]/20 rounded-xl">
                        <Phone className="text-[#635BFF]" size={24} />
                      </div>
                      <div>
                        <h3 className="text-gray-900 font-semibold mb-1">
                          咨询热线
                        </h3>
                        <p className="text-gray-600">13359282414</p>
                        <p className="text-gray-500 text-sm">
                          工作日 9:00-18:00
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card glass>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-[#635BFF]/20 rounded-xl">
                        <Mail className="text-[#635BFF]" size={24} />
                      </div>
                      <div>
                        <h3 className="text-gray-900 font-semibold mb-1">
                          商务合作
                        </h3>
                        <p className="text-gray-600">19993397696@163.com</p>
                        <p className="text-gray-500 text-sm">
                          24小时内回复
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card glass>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-[#635BFF]/20 rounded-xl">
                        <MapPin className="text-[#635BFF]" size={24} />
                      </div>
                      <div>
                        <h3 className="text-gray-900 font-semibold mb-1">
                          北京总公司
                        </h3>
                        <p className="text-gray-600">
                          北京市朝阳区凤凰置地广场A座21层
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card glass>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-[#635BFF]/20 rounded-xl">
                        <MapPin className="text-[#635BFF]" size={24} />
                      </div>
                      <div>
                        <h3 className="text-gray-900 font-semibold mb-1">
                          西安办公地
                        </h3>
                        <p className="text-gray-600">
                          陕西省西安市碑林区长安国际中心E座22层
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <Card glass className="bg-[#635BFF]/10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  为什么选择我们？
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="text-[#635BFF]" size={18} />
                    <span>行业领先的GEO技术和方法论</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="text-[#635BFF]" size={18} />
                    <span>500+企业的成功案例验证</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="text-[#635BFF]" size={18} />
                    <span>平均AI推荐率提升300%+</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="text-[#635BFF]" size={18} />
                    <span>专业团队7x24小时支持</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
