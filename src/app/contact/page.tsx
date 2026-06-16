export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-pcv-burgundy">Contact PCV</h1>
      <p className="mb-8 text-gray-600">
        Get in touch with the Presbyterian Church of Vanuatu headquarters.
      </p>

      <div className="section-card space-y-6">
        <div>
          <h2 className="font-semibold text-pcv-burgundy">Head Office</h2>
          <p className="mt-2 text-gray-600">
            Presbyterian Church of Vanuatu
            <br />
            Port Vila, Efate Island
            <br />
            Vanuatu
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-pcv-burgundy">General Enquiries</h2>
          <p className="mt-2 text-gray-600">
            Email: info@pcv.vu
            <br />
            Phone: +678 00000
          </p>
        </div>

        <form className="space-y-4 border-t border-pcv-cream-dark pt-6">
          <h2 className="font-semibold text-pcv-burgundy">Send a Message</h2>
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input type="text" className="input-field" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" className="input-field" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Message</label>
            <textarea className="input-field min-h-32" required />
          </div>
          <button type="submit" className="btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
