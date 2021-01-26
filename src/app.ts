export const qiankun = {
  // 应用加载之前
  async bootstrap(props: any) {
    console.log("bootstrap")
  },
  // 应用 render 之前触发
  async mount(props: any) {
    console.log("mount")
  },
  // 应用卸载之后触发
  async unmount(props: any) {
    console.log("unmount")
  },
  // loadMicroApp 方式加载微应用时生效
  async update(props: any) {
    console.log("update")
  },
};
