import { FaInstagram, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { prisma } from "@/lib/prisma";

async function getSocialLinks() {
  try {
    const links = await prisma.socialLink.findMany({
      where: { enabled: true },
      orderBy: { platform: 'asc' },
    });
    return links;
  } catch (error) {
    console.error('Error fetching social links:', error);
    return [];
  }
}

function getSocialIcon(platform: string) {
  const platformLower = platform.toLowerCase();
  if (platformLower.includes('instagram')) {
    return { Icon: FaInstagram, color: "#E1306C" };
  } else if (platformLower.includes('facebook')) {
    return { Icon: FaFacebook, color: "#1877F2" };
  } else if (platformLower.includes('twitter') || platformLower.includes('x')) {
    return { Icon: FaXTwitter, color: "#0b151bff" };
  }
  return null;
}

export default async function Footer() {
  const socialLinks = await getSocialLinks();

  return (
    <footer className="bg-navy text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 gold-gradient rounded-full grid place-items-center">
                <div className="text-navy font-bold text-lg">S</div>
              </div>
              <h3 className="text-2xl font-bold">Solis Espresso</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Where every cup tells a story of passion, quality, and community.
            </p>

            {/* Socials */}
            {socialLinks.length > 0 && (
              <div className="flex gap-4">
                {socialLinks.map((link: any) => {
                  const iconData = getSocialIcon(link.platform);
                  if (!iconData || !link.url) return null;
                  
                  const { Icon, color } = iconData;
                  return (
                    <a
                      key={link.id || link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Solis Espresso on ${link.platform}`}
                      className="w-10 h-10 rounded-full grid place-items-center hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    >
                      <Icon size={20} color="white" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-solis-gold">Opening Hours</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between"><span>Monday - Friday</span><span>5:30AM - 4:00PM</span></div>
              <div className="flex justify-between"><span>Saturday - Sunday</span><span>Closed</span></div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-solis-gold">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <p>Shop 2, 77 Berry Street</p>
              <p>North Sydney, NSW 2060, Australia</p>
              <p>(555) 123-COFFEE</p>
              <p>info@solisespresso.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-solis-gold/30 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Solis Espresso. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

