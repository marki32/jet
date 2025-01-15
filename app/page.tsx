import SearchForm from './components/SearchForm'

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
          YouTube URL Search
        </h1>
        <p className="mt-3 text-xl text-gray-500 sm:mt-4">
          Enter a YouTube URL to search and explore videos
        </p>
      </div>
      <div className="mt-10 sm:mt-12">
        <SearchForm />
      </div>
    </div>
  )
}

