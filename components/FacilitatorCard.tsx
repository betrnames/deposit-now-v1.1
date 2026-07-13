import { ExternalLink, Check, Globe, Code2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Facilitator } from '@/lib/facilitators';

function FeeBadge({ fees }: { fees: Facilitator['fees'] }) {
  if (fees === 'Free') {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/25 text-[10px] font-bold uppercase tracking-wide">
        Free
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/25 text-[10px] font-bold uppercase tracking-wide">
      {fees}
    </Badge>
  );
}

function StatusBadge({ status }: { status: Facilitator['status'] }) {
  if (status === 'testnet') {
    return (
      <Badge className="bg-blue-500/15 text-blue-400 border-blue-500/25 text-[10px] font-bold uppercase tracking-wide">
        Testnet
      </Badge>
    );
  }
  if (status === 'beta') {
    return (
      <Badge className="bg-purple-500/15 text-purple-400 border-purple-500/25 text-[10px] font-bold uppercase tracking-wide">
        Beta
      </Badge>
    );
  }
  return (
    <Badge className="bg-emerald-500/10 text-emerald-400/80 border-emerald-500/20 text-[10px] font-bold uppercase tracking-wide">
      Production
    </Badge>
  );
}

export function FacilitatorCard({
  facilitator,
  compact = false,
}: {
  facilitator: Facilitator;
  compact?: boolean;
}) {
  const f = facilitator;

  if (compact) {
    return (
      <a
        href={f.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Card className="bg-card/70 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group h-full">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <CardTitle className="text-white group-hover:text-primary transition-colors text-base">
                {f.name}
              </CardTitle>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0 ml-2 mt-0.5" />
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <FeeBadge fees={f.fees} />
              <StatusBadge status={f.status} />
            </div>
            <div className="flex flex-wrap gap-1">
              {f.chains.map((chain) => (
                <span
                  key={chain}
                  className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/70 bg-muted/40 rounded px-1.5 py-0.5"
                >
                  <Globe className="h-2.5 w-2.5" />
                  {chain}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </a>
    );
  }

  return (
    <Card className="bg-card/70 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-white group-hover:text-primary transition-colors text-lg">
            {f.name}
          </CardTitle>
          <ExternalLink className="h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors shrink-0 ml-2" />
        </div>
        <CardDescription className="text-muted-foreground leading-relaxed text-sm">
          {f.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex flex-wrap gap-1.5 mb-3">
          <FeeBadge fees={f.fees} />
          <StatusBadge status={f.status} />
          {f.openSource && (
            <Badge className="bg-violet-500/15 text-violet-400 border-violet-500/25 text-[10px] font-bold uppercase tracking-wide">
              <Code2 className="h-2.5 w-2.5 mr-1" />
              Open Source
            </Badge>
          )}
        </div>

        <div className="space-y-2 mb-4 flex-1">
          <div>
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold">
              Chains
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {f.chains.map((chain) => (
                <Badge
                  key={chain}
                  variant="outline"
                  className="text-[10px] text-foreground/70 border-border/60 bg-muted/30"
                >
                  {chain}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold">
              Tokens
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {f.tokens.map((token) => (
                <Badge
                  key={token}
                  variant="outline"
                  className="text-[10px] text-foreground/70 border-border/60 bg-muted/30"
                >
                  {token}
                </Badge>
              ))}
            </div>
          </div>

          {f.schemes.length > 0 && (
            <div>
              <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold">
                Schemes
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {f.schemes.map((scheme) => (
                  <Badge
                    key={scheme}
                    variant="outline"
                    className="text-[10px] text-foreground/70 border-border/60 bg-muted/30"
                  >
                    {scheme}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground/60 mb-4">
          {f.selfHostable && (
            <span className="inline-flex items-center gap-1">
              <Check className="h-3 w-3 text-emerald-500" />
              Self-hostable
            </span>
          )}
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary/80 mt-auto"
        >
          <a href={f.link} target="_blank" rel="noopener noreferrer">
            View Facilitator
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
