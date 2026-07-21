type LogoProps = {
  className?: string
}

function Logo({ className }: LogoProps) {
  return (
    <img
      src="/logo.svg"
      alt="Nutri Track"
      width={280}
      height={64}
      className={className}
    />
  )
}

export { Logo }
