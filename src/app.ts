export const qiankun = {
  // 应用加载之前
  async bootstrap(props: any) {},
  // 应用 render 之前触发
  async mount(props: any) {},
  // 应用卸载之后触发
  async unmount(props: any) {},
  // loadMicroApp 方式加载微应用时生效
  async update(props: any) {},
};

localStorage.setItem(
  'token',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiI2MDFhODkyMTZhMGUzODFmYjc4OGQxNjkiLCJleHAiOjE2Mjg4NDc3OTQsImlzcyI6ImZ1UmFuIn0.Cyg94bPRnF9YXdrgqC6A9qCbw19H3_g_1oY1nxLU5ck',
);
