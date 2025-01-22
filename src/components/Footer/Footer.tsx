import { endOfYear } from "date-fns";
const Footer = () => {
  return (
    <div className="border-t border-neutral-100 dark:border-white/[0.1] px-8 py-20 w-full relative overflow-hidden">
      <p
        className="text-center mt-20 text-[4rem] md:text-[7rem] lg:text-[10rem]
       xl:text-[13rem] font-bold bg-clip-text text-transparent 
       bg-gradient-to-b from-neutral-800 dark:from-neutral-500 to-neutral-200
        dark:to-neutral-800 inset-x-0 p-7"
      >
        Academix
      </p>
      <div className="max-w-7xl mx-auto text-sm text-neutral-500 flex flex-col sm:flex-row sm:flex-row-reverse justify-evenly items-start md:px-8">
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-10 items-start mt-10 sm:mt-0 md:mt-0 place-items-center">
          <div className="flex justify-center space-y-4 flex-col">
            <p className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold">
              Pages
            </p>
            <ul className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-4">
              <li className="list-none">
                <a
                  className="transition-colors hover:text-text-neutral-800 "
                  href="https://courses.chaicode.com/learn/view-all?show=mock-tests&amp;type=2"
                >
                  Daily Quiz
                </a>
              </li>
            </ul>
          </div>
          <div className="flex justify-center space-y-4 flex-col">
            <p className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold">
              Socials
            </p>
            <ul className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-4">
              <li className="list-none">
                <a
                  className="transition-colors hover:text-text-neutral-800 "
                  href="https://hitesh.ai/discord"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord
                </a>
              </li>
              <li className="list-none">
                <a
                  className="transition-colors hover:text-text-neutral-800 "
                  href="https://x.com/hiteshdotcom"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X | Twitter
                </a>
              </li>
              <li className="list-none">
                <a
                  className="transition-colors hover:text-text-neutral-800 "
                  href="https://hitesh.ai/whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li className="list-none">
                <a
                  className="transition-colors hover:text-text-neutral-800 "
                  href="https://www.linkedin.com/in/hiteshchoudhary/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li className="list-none">
                <a
                  className="transition-colors hover:text-text-neutral-800 "
                  href="https://www.instagram.com/hiteshchoudharyofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
          <div className="flex justify-center space-y-4 flex-col">
            <p className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold">
              Legal
            </p>
            <ul className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-4">
              <li className="list-none">
                <a
                  className="transition-colors hover:text-text-neutral-800 "
                  href="/privacy-policy"
                >
                  Privacy Policy
                </a>
              </li>
              <li className="list-none">
                <a
                  className="transition-colors hover:text-text-neutral-800 "
                  href="/terms-of-services"
                >
                  Terms of Service
                </a>
              </li>
              <li className="list-none">
                <a
                  className="transition-colors hover:text-text-neutral-800 "
                  href="/refund-policy"
                >
                  Refund policy
                </a>
              </li>
              <li className="list-none">
                <a
                  className="transition-colors hover:text-text-neutral-800 "
                  href="/pricing-policy"
                >
                  Pricing policy
                </a>
              </li>
            </ul>
          </div>
          <div className="flex justify-center space-y-4 flex-col">
            <p className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold">
              Register
            </p>
            <ul className="transition-colors hover:text-text-neutral-800 text-neutral-600 dark:text-neutral-300 list-none space-y-4">
              <li className="list-none">
                <a
                  className="transition-colors hover:text-text-neutral-800 "
                  href="https://courses.chaicode.com/learn/account/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sign Up
                </a>
              </li>
              <li className="list-none">
                <a
                  className="transition-colors hover:text-text-neutral-800 "
                  href="https://courses.chaicode.com/learn/account/signin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Login
                </a>
              </li>
              <li className="list-none">
                <a
                  className="transition-colors hover:text-text-neutral-800 "
                  href="https://courses.chaicode.com/learn/account/forgot-password"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Forgot Password
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full flex justify-center items-center flex-col">
          <div className="mt-2 ml-2 pt-5 w-full flex justify-start h-full items-center flex-col">
            © copyright {endOfYear(new Date()).getFullYear() - 1} -{" "}
            {endOfYear(new Date()).getFullYear()}. All rights reserved.
            <p className="mt-4">Home for programmers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
