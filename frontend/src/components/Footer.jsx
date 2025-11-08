import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-white shadow mt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-gray-600">
                <p className="text-sm">
                  ❤️ E-Com Cart 
                </p>
                <p className="text-xs mt-2 text-gray-500">
                  &copy; • {new Date().getFullYear()}
                </p>
              </div>
            </div>
          </footer>
  )
}

export default Footer