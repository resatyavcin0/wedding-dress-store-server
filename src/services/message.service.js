const fakeSendOtpPromise = () => {
  return new Promise((resolve) => setTimeout(resolve(true), 500));
};

const fakeReceiveVerifyOtpPromise = () => {
  return new Promise((resolve) => setTimeout(resolve(true), 500));
};

export default {
  fakeSendOtpPromise,
  fakeReceiveVerifyOtpPromise,
};
