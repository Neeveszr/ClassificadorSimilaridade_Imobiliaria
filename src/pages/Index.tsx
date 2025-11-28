import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Send, Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import imovel1 from "@/assets/imovel-1.jpg";
import imovel2 from "@/assets/imovel-2.jpg";
import imovel3 from "@/assets/imovel-3.jpg";
import imovel4 from "@/assets/imovel-4.jpg";

const Index = () => {
  const [mensagem, setMensagem] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categoria, setCategoria] = useState<string | null>(null);
  const [confianca, setConfianca] = useState<number | null>(null);

  const imoveis = [
    {
      id: 1,
      image: imovel1,
      tipo: "Venda",
      titulo: "Mansão Moderna",
      preco: "R$ 4.500.000",
    },
    {
      id: 2,
      image: imovel2,
      tipo: "Aluguel",
      titulo: "Cobertura Elegante",
      preco: "R$ 18.000/mês",
    },
    {
      id: 3,
      image: imovel3,
      tipo: "Venda",
      titulo: "Villa à Beira-Mar",
      preco: "R$ 6.200.000",
    },
    {
      id: 4,
      image: imovel4,
      tipo: "Aluguel",
      titulo: "Apartamento Premium",
      preco: "R$ 12.500/mês",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://neveszr.app.n8n.cloud/webhook/classificar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          texto: mensagem
        })
      });

      if (!response.ok) {
        console.error("Erro ao enviar:", response.status, await response.text());
        setCategoria("erro");
        setConfianca(0);
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      setCategoria(data.categoria ?? "não classificado");
      setConfianca(data.confianca ?? 0);

    } catch (err) {
      console.error("Erro geral:", err);
      setCategoria("erro");
      setConfianca(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <header className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-gold" />
            <h1 className="text-5xl font-bold text-navy tracking-tight">
              Prestige
            </h1>
          </div>
          <p className="text-xl font-light text-muted-foreground tracking-wide">
            Imobiliária de Alto Padrão
          </p>
          <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent"></div>
          
          <div className="mt-6 max-w-2xl mx-auto">
            <p className="text-base text-foreground/80 leading-relaxed">
              Especializada em residências de médio e alto padrão para <span className="font-semibold text-navy">aluguel e venda</span>.
              Atendimento personalizado de <span className="font-semibold text-navy">segunda a sexta-feira em horário comercial</span>.
            </p>
          </div>
        </header>

        {/* Carrossel de Imóveis */}
        <div className="mb-8 animate-fade-in">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {imoveis.map((imovel) => (
                <CarouselItem key={imovel.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden border-border/50 hover:border-gold/50 transition-all duration-300 hover:shadow-xl group">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={imovel.image}
                        alt={imovel.titulo}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-navy/90 text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                          {imovel.tipo}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground text-lg mb-1">
                        {imovel.titulo}
                      </h3>
                      <p className="text-gold font-bold text-xl">
                        {imovel.preco}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 border-gold/50 hover:bg-gold/10" />
            <CarouselNext className="right-2 border-gold/50 hover:bg-gold/10" />
          </Carousel>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Como podemos ajudá-lo?
              </h2>
              <p className="text-muted-foreground">
                Descreva sua necessidade em uma frase e nossa inteligência artificial detectará qual assunto você deseja tratar e qual o melhor departamento para lhe atender!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-medium text-foreground uppercase tracking-wide">
                  Seu E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base border-border/60 focus:border-gold focus:ring-gold/20 transition-all"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="mensagem" className="text-sm font-medium text-foreground uppercase tracking-wide">
                  Sua Mensagem
                </label>
                <Textarea
                  id="mensagem"
                  placeholder="Digite sua mensagem aqui..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  className="min-h-[180px] resize-none text-base border-border/60 focus:border-gold focus:ring-gold/20 transition-all"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-navy hover:bg-navy-light transition-all duration-300 shadow-lg hover:shadow-xl group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                    Classificar Mensagem
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result Card */}
        {categoria && (
          <Card className="shadow-2xl border-gold/30 bg-gradient-to-br from-gold/5 to-gold/10 backdrop-blur-sm animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <CardContent className="p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-2">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                  Setor Responsável
                </p>
                <h3 className="text-3xl font-bold text-navy">
                  {categoria.toUpperCase()}
                </h3>
              </div>

              {confianca !== null && (
                <p className="text-foreground/70">
                  Certeza da IA: <strong>{(Number(confianca) * 100).toFixed(1)}%</strong>
                </p>
              )}

              <div className="pt-4 mt-4 border-t border-gold/20">
                <p className="text-foreground/80 text-lg">
                  O setor já recebeu sua mensagem, entraremos em contato em até <span className="font-semibold text-gold">2 horas úteis</span>!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground">
          <p>© 2024 Prestige Imobiliária • Excelência em Imóveis de Luxo</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
