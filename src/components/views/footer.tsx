import {
  BuyMeACoffeeIcon,
  GitHubSponsorsIcon,
  GitHubIcon,
  LinkedInIcon,
  BlueSkyIcon,
  XIcon,
  HashnodeIcon,
  DevdotToIcon,
} from "@/icons";

export default function Footer() {
  return (
    <footer className="my-12 flex items-center justify-between py-7">
      <div className="flex flex-col">
        <span className="mb-0.5 text-xl 2xl:mb-1 2xl:text-3xl">
          Emmanuel C. Jemeni
        </span>
        <a
          href="http://"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-light 2xl:text-2xl"
        >
          @Jemeni11
        </a>
      </div>
      <div className="flex items-center gap-x-4">
        <a
          href="https://www.buymeacoffee.com/jemeni11"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BuyMeACoffeeIcon />
        </a>
        <a
          href="https://github.com/sponsors/Jemeni11/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubSponsorsIcon />
        </a>
      </div>
      <div className="flex items-center gap-x-4">
        <a
          href="https://github.com/Jemeni11/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </a>
        <a
          href="https://www.linkedin.com/in/emmanuel-jemeni"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon />
        </a>
        <a
          href="https://bsky.app/profile/jemeni11.bsky.social"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BlueSkyIcon />
        </a>
        <a
          href="https://twitter.com/Jemeni11_"
          target="_blank"
          rel="noopener noreferrer"
        >
          <XIcon />
        </a>
        <a
          href="https://jemeni11.hashnode.dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <HashnodeIcon />
        </a>
        <a
          href="https://dev.to/jemeni11"
          target="_blank"
          rel="noopener noreferrer"
        >
          <DevdotToIcon />
        </a>
      </div>
    </footer>
  );
}
