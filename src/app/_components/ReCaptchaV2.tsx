"use client";

import ReCAPTCHA from "react-google-recaptcha";

interface Props {
  siteKey: string;
  onVerify: (token: string | null) => void;
}

export const ReCaptchaV2 = ({ siteKey, onVerify }: Props) => {
  return (
    <ReCAPTCHA
      sitekey={siteKey}
      onChange={onVerify} // チェック成功時 or 期限切れ時に onVerify を呼び出す
    />
  );
};
