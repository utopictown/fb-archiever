import puppeteer from "puppeteer";
import readline from "readline";

const selector = {
  optionsToggle:
    ".nqmvxvec.j83agx80.jnigpg78.cxgpxx05.dflh9lhu.sj5x9vvc.scb9dxdr.odw8uiq3",
  optionArchive:
    ".oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.j83agx80.p7hjln8o.kvgmc6g5.oi9244e8.oygrvhab.h676nmdw.cxgpxx05.dflh9lhu.sj5x9vvc.scb9dxdr.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.l9j0dhe7.abiwlrkh.p8dawk7l.bp9cbjyn.dwo3fsh8.btwxx1t3.pfnyh3mw.du4w35lb",
  modal: ".a8c37x1j.ni8dbmo4.stjgntxs.l9j0dhe7.ltmttdrg.g0qnabr5.r8blr3vg",
  cancelModal:
    ".oajrlxb2.tdjehn4e.gcieejh5.bn081pho.humdl8nn.izx4hr6d.rq0escxv.nhd2j8a9.j83agx80.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.d1544ag0.qt6c0cv9.tw6a2znq.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.l9j0dhe7.abiwlrkh.p8dawk7l.beltcj47.p86d2i9g.aot14ch1.kzx2olss.cbu4d94t.taijpn5t.ni8dbmo4.stjgntxs.k4urcfbm.tv7at329",
  navbar:
    ".rq0escxv.pmk7jnqg.du4w35lb.j83agx80.pfnyh3mw.i1fnvgqd.gs1a9yip.owycx6da.btwxx1t3.datstx6m.pedkr2u6.i42f9fw1.n1dktuyu.k4urcfbm.dvqrsczn.l23jz15m.d4752i1f",
  main:
    ".rq0escxv.l9j0dhe7.du4w35lb.d2edcug0.hpfvmrgz.gile2uim.buofh1pr.g5gj957u.aov4n071.oi9244e8.bi6gxh9e.h676nmdw.aghb5jc5",
};

type TypeInput = {
  email: string;
  password: string;
  handle: string;
};

const init = async () => {
  const inputResult: TypeInput = await new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Please input your email: ", function (_email) {
      let email = _email;
      rl.question("Please input your password: ", function (_password) {
        let password = _password;
        rl.question(
          "Please input your facebook handle e.g. nagisa (from https://www.facebook.com/nagisa/): ",
          function (_handle) {
            let handle = _handle;
            console.log("enjoy!");
            rl.close();
            resolve({ email, password, handle });
          }
        );
      });
    });
  });
  return inputResult;
};

const app = async (data: TypeInput) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-notifications"],
  });
  try {
    const page = await browser.newPage();
    await page.goto("https://facebook.com");
    await page.waitForSelector("#email");
    await page.waitForSelector("#pass");
    await page.waitForSelector("#u_0_b");
    const emailInputElem = await page.$("#email");
    const passwordInputElem = await page.$("#pass");
    const loginButton = await page.$("#u_0_b");
    await emailInputElem?.type(data.email);
    await passwordInputElem?.type(data.password);
    await loginButton?.click();
    await page.waitFor(2000);
    await page.goto("https://www.facebook.com/" + data.handle);
    for (let i = 0; i < 999999999; i++) {
      await page.waitForSelector(selector.optionsToggle);
      const optionsToggle = await page.$(selector.optionsToggle);
      await optionsToggle?.click();
      await page.waitFor(2000);
      await page.waitForSelector(selector.optionArchive);
      const optionArchives = await page.$$(selector.optionArchive);
      let selectedKey = 0;
      let j = 0;
      for (const item of optionArchives) {
        const textOption = await item.evaluate((body) => body.innerHTML);
        if (textOption.indexOf("Activity log") > -1) {
          page.reload();
        }
        if (
          textOption.indexOf("Move to archive") > -1 ||
          textOption.indexOf("Hide from profile") > -1
        )
          selectedKey = j;
        j++;
      }
      if (j > 0) {
        optionArchives[selectedKey]?.click();
      }
      await page.waitFor(2000);
    }
  } catch (error) {
    console.log(error);
    await browser.close();
    app(data);
  }
};

(async () => {
  const data = await init();
  app(data);
})();
