const page = () => {
  return (
    <div>
      <div className="min-h-screen flex justify-center items-center">
        <section className="py-16 px-6 lg:px-32">
          <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
          <p className="text-center max-w-2xl mx-auto mb-12">
            We are a team of passionate individuals dedicated to providing the
            best online learning experiences. Our mission is to make quality
            education accessible to everyone, anywhere in the world.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p>
                To empower learners with knowledge and skills to achieve their
                goals.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
              <p>
                To revolutionize the education industry with technology and
                innovation.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Our Values</h3>
              <p>
                Integrity, innovation, and inclusivity are at the heart of
                everything we do.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
