import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'

const RoleCard = ({ title, description, icon, onClick }: any)=> {
  return (
    <Card 
      className="relative group cursor-pointer hover:border-primary transition-all duration-300 shadow-md overflow-hidden"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center space-x-4 pt-8">
        <div className="p-3 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="mt-2 line-clamp-2">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-8">
        <Button variant="ghost" className="w-full justify-between mt-4 group-hover:bg-primary group-hover:text-white">
          Get Started
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default RoleCard