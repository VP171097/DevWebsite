import React, { useRef, useState } from "react";
import { MagicCard } from "@/components/magicui/magic-card";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { Mail, User, MessageSquare, Send, CheckCircle2, AlertCircle, Phone, MapPin, Sparkles, Activity } from "lucide-react";

const ContactSection = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = (data) => {
    const errs = {};
    const name = data.get("name")?.trim();
    const email = data.get("email")?.trim();
    const message = data.get("message")?.trim();

    if (!name || name.length < 2) {
      errs.name = "Please enter your name (minimum 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errs.email = "Please enter a valid email address.";
    }

    if (!message || message.length < 10) {
      errs.message = "Please write a message of at least 10 characters.";
    }

    return errs;
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    setStatus(null);

    const formData = new FormData(form.current);
    const formErrors = validateForm(formData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const web3FormsKey =
      import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "67a7fa23-f9fa-4806-ab7a-fc9176ad1bb1";

    try {
      formData.append("access_key", web3FormsKey);
      formData.append("subject", `New Data Engineering Inquiry from: ${formData.get("name")}`);
      formData.append("from_name", "Data Engineering Portfolio");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: "success",
          text: "Thank you! Your message has been sent successfully. I will get back to you promptly.",
        });
        form.current.reset();
      } else {
        console.error("Web3Forms error:", data);
        setStatus({
          type: "error",
          text: data.message || "Failed to send message via form. Please email directly to vivekpandey.iimt@gmail.com",
        });
      }
    } catch (err) {
      console.error("Web3Forms error:", err);
      setStatus({
        type: "error",
        text: "Network error occurred. Please email directly to vivekpandey.iimt@gmail.com",
      });
    } finally {
      setLoading(false);
    }
  };

  const pipelineGifUrl = `${import.meta.env.BASE_URL}assets/pipeline.gif`;

  return (
    <div id="contact" className="rounded-2xl container bg-black/50 py-10 scroll-mt-24">
      <div className="flex flex-col xl:flex-row justify-center items-stretch gap-8 w-full px-4 xl:px-8 max-w-6xl mx-auto">
        {/* Form Section */}
        <MagicCard
          gradientSize={400}
          gradientFrom="#0ea5e9"
          gradientTo="#22d3ee"
          className="rounded-2xl w-full xl:w-3/5 text-white p-6 md:p-8"
        >
          <div className="text-left mb-6">
            <p className="text-xs tracking-widest text-sky-400 font-bold mb-1">
              LET'S CONNECT
            </p>
            <h2 className="text-2xl sm:text-3xl font-black mb-2">
              <SparklesText>Get In Touch</SparklesText>
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm">
              Have an enterprise Data Engineering opportunity, lakehouse consultation, or technical question? Drop me a message below.
            </p>
          </div>

          {status && (
            <div
              className={`mb-6 p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${status.type === "success"
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                : "bg-red-950/80 text-red-300 border border-red-500/40"
                }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
              )}
              <span>{status.text}</span>
            </div>
          )}

          <form ref={form} onSubmit={sendEmail} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="flex items-center text-xs font-semibold text-gray-300 mb-1"
              >
                <User className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className={`w-full rounded-xl border ${errors.name ? "border-red-500" : "border-neutral-800 focus:border-sky-400"
                  } bg-neutral-900/90 text-white p-3 text-xs sm:text-sm focus:outline-none transition`}
                placeholder="e.g. Alex Morgan"
              />
              {errors.name && (
                <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="flex items-center text-xs font-semibold text-gray-300 mb-1"
              >
                <Mail className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={`w-full rounded-xl border ${errors.email ? "border-red-500" : "border-neutral-800 focus:border-sky-400"
                  } bg-neutral-900/90 text-white p-3 text-xs sm:text-sm focus:outline-none transition`}
                placeholder="alex@company.com"
              />
              {errors.email && (
                <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="flex items-center text-xs font-semibold text-gray-300 mb-1"
              >
                <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                required
                className={`w-full rounded-xl border ${errors.message ? "border-red-500" : "border-neutral-800 focus:border-sky-400"
                  } bg-neutral-900/90 text-white p-3 text-xs sm:text-sm focus:outline-none transition leading-relaxed`}
                placeholder="Let's collaborate on a Big Data or Databricks project..."
              />
              {errors.message && (
                <p className="text-[11px] text-red-400 mt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${loading
                ? "bg-neutral-800 text-neutral-400 cursor-not-allowed"
                : "bg-sky-500 hover:bg-sky-400 text-black shadow-lg shadow-sky-500/20 hover:scale-[1.01]"
                }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                    />
                  </svg>
                  <span>Transmitting Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </MagicCard>

        {/* Compact Quick Contact & Pipeline GIF Section */}
        <div className="w-full xl:w-2/5 flex flex-col justify-between gap-4">
          {/* Compact Direct Channels Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/90 border border-neutral-800 text-white shadow-xl">
            <h3 className="text-base font-bold text-sky-400 mb-3 flex items-center gap-2">
              <Sparkles size={16} />
              <span>Direct Channels</span>
            </h3>

            <div className="space-y-2.5">
              <a
                href="mailto:vivekpandey.iimt@gmail.com"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800/90 border border-neutral-800 hover:border-sky-400/50 transition group"
              >
                <div className="p-2 rounded-lg bg-sky-400/10 text-sky-400 group-hover:scale-110 transition-transform shrink-0">
                  <Mail size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-neutral-400 uppercase font-semibold">Email Address</p>
                  <p className="text-xs sm:text-sm font-bold text-white group-hover:text-sky-300 truncate">
                    vivekpandey.iimt@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://wa.me/917011088059"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800/90 border border-neutral-800 hover:border-emerald-400/50 transition group"
              >
                <div className="p-2 rounded-lg bg-emerald-400/10 text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                  <Phone size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-neutral-400 uppercase font-semibold">WhatsApp / Phone</p>
                  <p className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300">
                    +91 7011088059
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <div className="p-2 rounded-lg bg-cyan-400/10 text-cyan-400 shrink-0">
                  <MapPin size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-neutral-400 uppercase font-semibold">Location</p>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    Noida / Delhi NCR, India (Open to Remote / Hybrid)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Pipeline Flow GIF */}
          <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950/90 p-3 shadow-xl flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 self-start mb-2 px-1 text-xs font-semibold text-neutral-400">
              <Activity size={13} className="text-sky-400" />
            </div>
            <img
              src={pipelineGifUrl}
              alt="Data Engineering Pipeline Flow Animation"
              className="w-full h-auto max-h-52 rounded-xl object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
