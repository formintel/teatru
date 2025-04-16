const Map = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="h-[400px] w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.1234567890!2d26.1025!3d44.4268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sTeatrul+DramArena!5e0!3m2!1sro!2sro!4v1234567890"
          width="100%"
          height="100%"
          style={{ 
            border: 0,
            filter: 'grayscale(50%) sepia(20%)',
            borderRadius: '0.5rem'
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="mt-4 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="font-bold text-lg">Teatrul DramArena</h3>
        <p className="text-sm text-gray-600">Strada Teatrului nr. 1</p>
        <p className="text-sm text-gray-600">București, România</p>
        <p className="text-sm text-gray-600">Program: Luni - Duminică: 10:00 - 22:00</p>
      </div>
    </div>
  );
};

export default Map; 