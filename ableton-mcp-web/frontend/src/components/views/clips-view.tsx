"use client"

import { useAbletonProject } from "../ableton-project-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Square, Edit, Plus } from "lucide-react"

export function ClipsView() {
  const { project, launchClip, stopClip } = useAbletonProject()

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Clips</h2>

      <div className="space-y-4 flex-1 overflow-auto">
        {project.tracks.map((track) => (
          <Card key={track.id} className="overflow-hidden">
            <CardHeader className="p-3" style={{ backgroundColor: track.color + "20" }}>
              <CardTitle className="text-sm font-medium">{track.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                {track.clips.map((clip) => (
                  <div key={clip.id} className="flex flex-col gap-1">
                    <div
                      className={`relative flex h-16 w-full flex-col justify-between rounded-md p-2 ${
                        clip.playing ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                      style={{
                        borderLeft: `4px solid ${clip.color}`,
                        opacity: clip.playing ? 1 : 0.8,
                      }}
                    >
                      <span className="text-xs font-medium truncate">{clip.name}</span>
                      <span className="text-xs opacity-70">{clip.length} bars</span>

                      <div className="absolute bottom-1 right-1 flex gap-1">
                        {clip.playing ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 bg-primary-foreground/20 text-primary-foreground"
                            onClick={() => stopClip(track.id, clip.id)}
                          >
                            <Square className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 bg-background/20"
                            onClick={() => launchClip(track.id, clip.id)}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <Button variant="ghost" size="icon" className="h-6 w-6 self-end">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                <div className="flex h-16 w-full items-center justify-center rounded-md border border-dashed border-muted-foreground/50">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
