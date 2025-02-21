const page = () => {
  return (
    <div>
      <div className="min-h-screen flex justify-center items-center">
        <section className="py-16 px-6 lg:px-32">
          <h1 className="text-4xl font-bold text-center mb-8">Contact Us </h1>
          <p className="text-center max-w-2xl mx-auto mb-12">
            Have a question or need assistance? Feel free to reach out to us,
            and we'll get back to you as soon as possible.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-3xl mx-auto">
            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Write your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#27E0B3] text-white rounded-lg hover:bg-[#27e0b2ac] transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
