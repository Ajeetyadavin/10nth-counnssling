import 'dotenv/config';

interface SendOtpInput {
  mobile: string;
  otp: string;
  minutes: number;
  correlationId: string;
}

const DOMAIN = process.env.SMS_API_DOMAIN || 'sms.timesapi.in';
const PATH = process.env.SMS_API_PATH || '/api/v1/send';
const USERNAME = process.env.SMS_API_USERNAME || '';
const PASSWORD = process.env.SMS_API_PASSWORD || '';
const SENDER_ID = process.env.SMS_SENDER_ID || 'EDNVTE';
const PLATFORM_NAME = process.env.SMS_PLATFORM_NAME || 'Ednovate';
const DLT_CONTENT_ID = process.env.SMS_DLT_CONTENT_ID || '';
const SMS_UNICODE = process.env.SMS_UNICODE === 'true' ? 'true' : 'false';

const timeoutMs = Number(process.env.SMS_TIMEOUT_MS || 12000);

const assertSmsConfig = () => {
  const missing = [
    !USERNAME ? 'SMS_API_USERNAME' : '',
    !PASSWORD ? 'SMS_API_PASSWORD' : '',
    !SENDER_ID ? 'SMS_SENDER_ID' : '',
    !DLT_CONTENT_ID ? 'SMS_DLT_CONTENT_ID' : ''
  ].filter(Boolean);

  if (missing.length > 0) {
    if (process.env.NODE_ENV !== 'production') {
      return false;
    }
    throw new Error(`Missing SMS config: ${missing.join(', ')}`);
  }

  return true;
};

const buildMessage = ({ otp, minutes }: { otp: string; minutes: number }) => {
  const template =
    process.env.SMS_OTP_TEMPLATE ||
    'Your OTP for Ednovate is {{otp}}. It is valid for 10 minutes.';

  return template
    .replace(/{{\s*platformName\s*}}/g, PLATFORM_NAME)
    .replace(/{{\s*otp\s*}}/g, otp)
    .replace(/{{\s*minutes\s*}}/g, String(minutes));
};

const endpoint = () => `https://${DOMAIN}${PATH}`;

const sendViaPost = async (params: URLSearchParams) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString(),
      signal: controller.signal
    });

    const body = await response.text();
    if (!response.ok) {
      throw new Error(`SMS provider error (${response.status}): ${body}`);
    }

    return body;
  } finally {
    clearTimeout(timer);
  }
};

const sendViaGet = async (params: URLSearchParams) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${endpoint()}?${params.toString()}`, {
      method: 'GET',
      signal: controller.signal
    });

    const body = await response.text();
    if (!response.ok) {
      throw new Error(`SMS provider error (${response.status}): ${body}`);
    }

    return body;
  } finally {
    clearTimeout(timer);
  }
};

export const sendOtpSms = async ({ mobile, otp, minutes, correlationId }: SendOtpInput) => {
  const canSend = assertSmsConfig();
  const message = buildMessage({ otp, minutes });

  if (!canSend) {
    console.log(`[DEV OTP] ${mobile} => ${otp}`);
    return { mocked: true };
  }

  const params = new URLSearchParams({
    username: USERNAME,
    password: PASSWORD,
    unicode: SMS_UNICODE,
    from: SENDER_ID,
    to: mobile,
    text: message,
    dltContentId: DLT_CONTENT_ID
  });

  // Some providers support/require an additional request identifier; enable only when needed.
  if (process.env.SMS_INCLUDE_CORRELATION_ID === 'true') {
    params.set('corelationId', correlationId);
  }

  try {
    const getResponse = await sendViaGet(params);
    return { mocked: false, response: getResponse };
  } catch (getErr) {
    const postResponse = await sendViaPost(params);
    return { mocked: false, response: postResponse, getError: String(getErr) };
  }
};
