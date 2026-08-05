import { getProducts } from '@/lib/data/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createProduct } from '@/lib/actions/products'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Vitrine de produtos</h1>
        <p className="text-muted-foreground">Produtos e serviços das membras da comunidade.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anunciar produto/serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProduct} className="space-y-3">
            <Input name="name" placeholder="Nome do produto ou serviço" required />
            <Textarea name="description" placeholder="Descrição" />
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Preço</Label>
                <Input id="price" name="price" type="number" min={0} step={0.01} placeholder="0,00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link</Label>
                <Input id="link" name="link" type="url" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">URL da imagem</Label>
                <Input id="image_url" name="image_url" type="url" placeholder="https://..." />
              </div>
            </div>
            <Button type="submit">Publicar</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product: any) => (
          <Card key={product.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={product.profiles?.photo_url || undefined} />
                  <AvatarFallback style={{ backgroundColor: product.profiles?.color }} className="text-white">
                    {product.profiles?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{product.profiles?.name}</p>
                  <p className="text-sm text-muted-foreground">{product.profiles?.business}</p>
                </div>
              </div>

              <h3 className="font-semibold">{product.name}</h3>
              {product.description && <p className="text-sm text-muted-foreground">{product.description}</p>}
              {product.image_url && (
                <img src={product.image_url} alt="" className="rounded-md max-h-40 object-cover w-full" />
              )}
              {product.price && <p className="text-sm font-medium">R$ {Number(product.price).toFixed(2)}</p>}
              {product.link && (
                <Button asChild size="sm" variant="outline" className="w-full">
                  <a href={product.link} target="_blank" rel="noopener noreferrer">
                    Acessar
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum produto anunciado ainda.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
