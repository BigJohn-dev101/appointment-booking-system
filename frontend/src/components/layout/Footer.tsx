export default function Footer() {
  const productLinks = ['Features', 'Pricing', 'Integrations', 'Updates'];
  const companyLinks = ['About Us', 'Contact', 'Support'];
  const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];
  const socialLinks = ['LinkedIn', 'Facebook', 'Instagram'];

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="brand-wrap">
              <div className="brand-mark">A</div>
              <h3 className="brand-name">AppointHub</h3>
            </div>

            <p className="footer-copy">
              Helping service businesses manage appointments, staff schedules,
              and customer bookings with confidence.
            </p>
          </div>

          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              {productLinks.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              {legalLinks.map((link) => (
                <li key={link}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AppointHub. All rights reserved.</p>

          <div className="socials">
            {socialLinks.map((link) => (
              <a key={link} href="#">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}