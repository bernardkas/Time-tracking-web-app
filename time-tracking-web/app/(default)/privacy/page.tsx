import React from 'react';

const Privacy = () => {
  return (
    <div className='mx-3 my-16 md:mx-[15%]'>
      <div>
        <h1 className='font-bold text-xl mb-5 border-b-[2px] pb-1'>
          Privacy Policy
        </h1>
        <div className='flex flex-col gap-4'>
          <p className='font-noto-sans'>
            At FoundLostX, we understand the importance of your privacy and are
            committed to protecting it. This Privacy Policy outlines how we
            collect, use, and safeguard your personal information when you use
            our website or services.
          </p>
          <p className='font-noto-sans'>
            <label className='font-bold'>Information We Collect:</label>
            Personal Information: When you use our website or services, we may
            collect personal information such as your name, email address,
            contact details, and any other information you voluntarily provide.
            Usage Information: We may also collect information about how you
            interact with our website, such as your IP address, browser type,
            pages visited, and other usage statistics.
          </p>
          <p className='font-noto-sans'>
            <label className='font-bold'>How We Use Your Information:</label>
            Providing Services: We use your personal information to provide and
            improve our services, including facilitating the posting and
            searching of lost or found items, communicating with users, and
            customizing your experience on our platform. Analytics: We may use
            usage information to analyze trends, track user interactions, and
            improve the functionality and performance of our website.
          </p>
          <p className='font-noto-sans'>
            <label className='font-bold'>Data Security:</label>
            Security Measures: We implement security measures to protect your
            personal information from unauthorized access, alteration,
            disclosure, or destruction. However, please note that no method of
            transmission over the internet or electronic storage is 100% secure,
            and we cannot guarantee absolute security.
          </p>
          <p className='font-noto-sans'>
            <label className='font-bold'>Third-Party Services:</label>
            Third-Party Links: Our website may contain links to third-party
            websites or services that are not owned or controlled by FoundLostX.
            We are not responsible for the privacy practices or content of these
            third-party sites.
          </p>
          <p className='font-noto-sans'>
            <label className='font-bold'>Changes to This Policy:</label>
            Policy Updates: We may update this Privacy Policy from time to time
            to reflect changes in our practices or for other operational, legal,
            or regulatory reasons. We encourage you to review this policy
            periodically for any updates.
          </p>
          <p className='font-noto-sans'>
            <label className='font-bold'>Contact Us:</label>
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact us at foundlostx@gmail.com. By
            using our website or services, you consent to the terms of this
            Privacy Policy. <br />
            This Privacy Policy was last updated on 13/04/2024.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
