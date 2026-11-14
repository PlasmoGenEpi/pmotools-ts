// @ts-nocheck
/* eslint-disable */
// Validator for PMO JSON Schema v1.1.0.
// Generated from schemas/portable_microhaplotype_object_v1.1.0.schema.json by scripts/build-validators.mjs. Do not edit by hand.
// Patterns were translated from Python regex semantics; see that script.
"use strict";
export const validate: import("../standalone.js").StandaloneValidator = validate36;
const schema13 = {"$defs":{"BioMethod":{"additionalProperties":true,"properties":{"additional_argument":{"items":{"pattern":"^[A-z-._0-9{}\\(\\),\\/ ]+(?=\\n?$)","type":"string"},"type":["array","null"]},"program":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"program_description":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"program_url":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"program_version":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"}},"required":["program_version","program"],"type":"object"},"BioinformaticsMethodInfo":{"additionalProperties":true,"properties":{"methods":{"items":{"$ref":"#/$defs/BioMethod"},"type":"array"}},"required":["methods"],"type":"object"},"BioinformaticsRunInfo":{"additionalProperties":true,"properties":{"bioinformatics_methods_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"bioinformatics_run_name":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"run_date":{"pattern":"[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?","type":["string","null"]}},"required":["bioinformatics_methods_id","bioinformatics_run_name"],"type":"object"},"DetectedMicrohaplotypes":{"additionalProperties":true,"properties":{"bioinformatics_run_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":["integer","null"]},"library_samples":{"items":{"$ref":"#/$defs/DetectedMicrohaplotypesForSample"},"type":"array"}},"required":["library_samples"],"type":"object"},"DetectedMicrohaplotypesForSample":{"additionalProperties":true,"properties":{"library_sample_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"target_results":{"items":{"$ref":"#/$defs/DetectedMicrohaplotypesForTarget"},"type":"array"}},"required":["library_sample_id","target_results"],"type":"object"},"DetectedMicrohaplotypesForTarget":{"additionalProperties":true,"properties":{"mhaps":{"items":{"$ref":"#/$defs/MicrohaplotypeForTarget"},"type":"array"},"mhaps_target_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"}},"required":["mhaps_target_id","mhaps"],"type":"object"},"GenomeInfo":{"additionalProperties":true,"properties":{"chromosomes":{"items":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"},"type":["array","null"]},"genome_version":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"},"gff_url":{"pattern":"^(https?|ftp):\\/\\/[^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}/$.?#][^\\n][^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}]*(?=\\n?$)","type":["string","null"]},"name":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"},"taxon_id":{"items":{"minimum":0,"pattern":"^[0-9](?=\\n?$)","type":"integer"},"type":"array"},"url":{"pattern":"^(?:NA|(https?|ftp):\\/\\/[^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}/$.?#][^\\n][^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}]*)(?=\\n?$)","type":"string"}},"required":["name","genome_version","taxon_id","url"],"type":"object"},"GenomicLocation":{"additionalProperties":true,"properties":{"alt_seq":{"pattern":"^[A-z-]+(?=\\n?$)","type":["string","null"]},"chrom":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"},"end":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"genome_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"ref_seq":{"pattern":"^[A-z-]+(?=\\n?$)","type":["string","null"]},"start":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"strand":{"pattern":"[+-]","type":["string","null"]}},"required":["genome_id","chrom","start","end"],"type":"object"},"LibrarySampleInfo":{"additionalProperties":true,"properties":{"alternate_identifiers":{"items":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"type":["array","null"]},"experiment_accession":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":["string","null"]},"fastqs_loc":{"pattern":"^[A-z-.;,_0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"library_prep_plate_info":{"anyOf":[{"$ref":"#/$defs/PlateInfo"},{"type":"null"}]},"library_sample_name":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"panel_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"qpcr_parasite_density_info":{"items":{"$ref":"#/$defs/ParasiteDensity"},"type":["array","null"]},"run_accession":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":["string","null"]},"sequencing_info_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":["integer","null"]},"specimen_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"}},"required":["specimen_id","panel_id","library_sample_name"],"type":"object"},"MarkerOfInterest":{"additionalProperties":true,"properties":{"associations":{"items":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"},"type":["array","null"]},"marker_location":{"$ref":"#/$defs/GenomicLocation"}},"required":["marker_location"],"type":"object"},"MaskingInfo":{"additionalProperties":true,"properties":{"masking_generation_description":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"replacement_size":{"minimum":0,"type":"integer"},"seq_segment_size":{"minimum":0,"type":"integer"},"seq_start":{"minimum":0,"type":"integer"}},"required":["seq_start","seq_segment_size","replacement_size"],"type":"object"},"MicrohaplotypeForTarget":{"additionalProperties":true,"properties":{"mhap_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"reads":{"minimum":0,"type":"integer"},"umis":{"minimum":0,"type":["integer","null"]}},"required":["mhap_id","reads"],"type":"object"},"PanelInfo":{"additionalProperties":true,"properties":{"panel_name":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"},"reactions":{"items":{"$ref":"#/$defs/ReactionInfo"},"type":"array"}},"required":["reactions","panel_name"],"type":"object"},"ParasiteDensity":{"additionalProperties":true,"properties":{"date_measured":{"pattern":"(?:[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?)?|NA)","type":["string","null"]},"density_method_comments":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"parasite_density":{"minimum":0,"pattern":"^[-+]?\\\\d*\\\\[^\\n]?\\\\d+(?:[eE][-+]?\\\\d+)?(?=\\n?$)","type":"number"},"parasite_density_method":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"}},"required":["parasite_density_method","parasite_density"],"type":"object"},"PlateInfo":{"additionalProperties":true,"properties":{"plate_col":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"plate_name":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"plate_row":{"pattern":"^[A-z](?=\\n?$)","type":"string"}},"required":["plate_name","plate_row","plate_col"],"type":"object"},"PmoGenerationMethod":{"additionalProperties":true,"properties":{"program_name":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"program_version":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"}},"required":["program_version","program_name"],"type":"object"},"PmoHeader":{"additionalProperties":true,"properties":{"creation_date":{"pattern":"[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?","type":["string","null"]},"generation_method":{"anyOf":[{"$ref":"#/$defs/PmoGenerationMethod"},{"type":"null"}]},"pmo_version":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"}},"required":["pmo_version"],"type":"object"},"PortableMicrohaplotypeObject":{"additionalProperties":true,"properties":{"bioinformatics_methods_info":{"items":{"$ref":"#/$defs/BioinformaticsMethodInfo"},"type":["array","null"]},"bioinformatics_run_info":{"items":{"$ref":"#/$defs/BioinformaticsRunInfo"},"type":["array","null"]},"detected_microhaplotypes":{"items":{"$ref":"#/$defs/DetectedMicrohaplotypes"},"type":"array"},"library_sample_info":{"items":{"$ref":"#/$defs/LibrarySampleInfo"},"type":"array"},"panel_info":{"items":{"$ref":"#/$defs/PanelInfo"},"type":"array"},"pmo_header":{"$ref":"#/$defs/PmoHeader"},"project_info":{"items":{"$ref":"#/$defs/ProjectInfo"},"type":["array","null"]},"read_counts_by_stage":{"items":{"$ref":"#/$defs/ReadCountsByStage"},"type":["array","null"]},"representative_microhaplotypes":{"$ref":"#/$defs/RepresentativeMicrohaplotypes"},"sequencing_info":{"items":{"$ref":"#/$defs/SequencingInfo"},"type":["array","null"]},"specimen_info":{"items":{"$ref":"#/$defs/SpecimenInfo"},"type":"array"},"target_info":{"items":{"$ref":"#/$defs/TargetInfo"},"type":"array"},"targeted_genomes":{"items":{"$ref":"#/$defs/GenomeInfo"},"type":["array","null"]}},"required":["library_sample_info","specimen_info","panel_info","target_info","representative_microhaplotypes","detected_microhaplotypes","pmo_header"],"type":"object"},"PrimerInfo":{"additionalProperties":true,"properties":{"location":{"anyOf":[{"$ref":"#/$defs/GenomicLocation"},{"type":"null"}]},"seq":{"pattern":"^[A-z]+(?=\\n?$)","type":"string"}},"required":["seq"],"type":"object"},"ProjectInfo":{"additionalProperties":true,"properties":{"BioProject_accession":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":["string","null"]},"project_collector_chief_scientist":{"pattern":"^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"project_contributors":{"items":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"type":["array","null"]},"project_description":{"type":"string"},"project_name":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"project_type":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":["string","null"]}},"required":["project_name","project_description"],"type":"object"},"ProteinVariant":{"additionalProperties":true,"properties":{"alternative_gene_name":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":["string","null"]},"codon_genomic_location":{"anyOf":[{"$ref":"#/$defs/GenomicLocation"},{"type":"null"}]},"gene_name":{"pattern":"^[A-z-._0-9:]+(?=\\n?$)","type":["string","null"]},"protein_location":{"$ref":"#/$defs/GenomicLocation"}},"required":["protein_location"],"type":"object"},"Pseudocigar":{"additionalProperties":true,"properties":{"pseudocigar_generation_description":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"pseudocigar_seq":{"pattern":"^[a-zA-Z0-9+=.]+(?=\\n?$)","type":"string"},"ref_loc":{"$ref":"#/$defs/GenomicLocation"}},"required":["pseudocigar_seq","ref_loc"],"type":"object"},"ReactionInfo":{"additionalProperties":true,"properties":{"panel_targets":{"items":{"minimum":0,"type":"integer"},"type":"array"},"reaction_name":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"}},"required":["panel_targets","reaction_name"],"type":"object"},"ReadCountsByStage":{"additionalProperties":true,"properties":{"bioinformatics_run_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":["integer","null"]},"read_counts_by_library_sample_by_stage":{"items":{"$ref":"#/$defs/ReadCountsByStageForLibrarySample"},"type":"array"}},"required":["read_counts_by_library_sample_by_stage"],"type":"object"},"ReadCountsByStageForLibrarySample":{"additionalProperties":true,"properties":{"library_sample_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"read_counts_for_targets":{"items":{"$ref":"#/$defs/ReadCountsByStageForTarget"},"type":["array","null"]},"total_raw_count":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"}},"required":["library_sample_id","total_raw_count"],"type":"object"},"ReadCountsByStageForTarget":{"additionalProperties":true,"properties":{"stages":{"items":{"$ref":"#/$defs/StageReadCounts"},"type":"array"},"target_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"}},"required":["target_id","stages"],"type":"object"},"RepresentativeMicrohaplotype":{"additionalProperties":true,"properties":{"alt_annotations":{"items":{"type":"string"},"type":["array","null"]},"associated_protein_variants":{"items":{"$ref":"#/$defs/ProteinVariant"},"type":["array","null"]},"associated_seq_variants":{"items":{"$ref":"#/$defs/GenomicLocation"},"type":["array","null"]},"masking":{"items":{"$ref":"#/$defs/MaskingInfo"},"type":["array","null"]},"microhaplotype_name":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":["string","null"]},"pseudocigar":{"anyOf":[{"$ref":"#/$defs/Pseudocigar"},{"type":"null"}]},"quality":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":["string","null"]},"seq":{"pattern":"^[A-z]+(?=\\n?$)","type":"string"}},"required":["seq"],"type":"object"},"RepresentativeMicrohaplotypes":{"additionalProperties":true,"properties":{"targets":{"items":{"$ref":"#/$defs/RepresentativeMicrohaplotypesForTarget"},"type":"array"}},"required":["targets"],"type":"object"},"RepresentativeMicrohaplotypesForTarget":{"additionalProperties":true,"properties":{"mhap_location":{"anyOf":[{"$ref":"#/$defs/GenomicLocation"},{"type":"null"}]},"microhaplotypes":{"items":{"$ref":"#/$defs/RepresentativeMicrohaplotype"},"type":"array"},"target_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"}},"required":["target_id","microhaplotypes"],"type":"object"},"SequencingInfo":{"additionalProperties":true,"properties":{"library_kit":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"library_layout":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"library_screen":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"library_selection":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"library_source":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"library_strategy":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"nucl_acid_amp":{"pattern":"^(https?|ftp):\\/\\/[^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}/$.?#][^\\n][^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}]*(?=\\n?$)","type":["string","null"]},"nucl_acid_amp_date":{"pattern":"[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?","type":["string","null"]},"nucl_acid_ext":{"pattern":"^(https?|ftp):\\/\\/[^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}/$.?#][^\\n][^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}]*(?=\\n?$)","type":["string","null"]},"nucl_acid_ext_date":{"pattern":"[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?","type":["string","null"]},"pcr_cond":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"seq_center":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"seq_date":{"pattern":"[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?","type":["string","null"]},"seq_instrument_model":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"seq_platform":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"sequencing_info_name":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"}},"required":["sequencing_info_name","seq_platform","seq_instrument_model","library_layout","library_strategy","library_source","library_selection"],"type":"object"},"SpecimenInfo":{"additionalProperties":true,"properties":{"alternate_identifiers":{"items":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"type":["array","null"]},"blood_meal":{"type":["boolean","null"]},"collection_country":{"pattern":"^[\\u{30}-\\u{39}\\u{41}-\\u{5a}\\u{5f}\\u{61}-\\u{7a}\\u{aa}\\u{b2}-\\u{b3}\\u{b5}\\u{b9}-\\u{ba}\\u{bc}-\\u{be}\\u{c0}-\\u{d6}\\u{d8}-\\u{f6}\\u{f8}-\\u{2c1}\\u{2c6}-\\u{2d1}\\u{2e0}-\\u{2e4}\\u{2ec}\\u{2ee}\\u{370}-\\u{374}\\u{376}-\\u{377}\\u{37a}-\\u{37d}\\u{37f}\\u{386}\\u{388}-\\u{38a}\\u{38c}\\u{38e}-\\u{3a1}\\u{3a3}-\\u{3f5}\\u{3f7}-\\u{481}\\u{48a}-\\u{52f}\\u{531}-\\u{556}\\u{559}\\u{560}-\\u{588}\\u{5d0}-\\u{5ea}\\u{5ef}-\\u{5f2}\\u{620}-\\u{64a}\\u{660}-\\u{669}\\u{66e}-\\u{66f}\\u{671}-\\u{6d3}\\u{6d5}\\u{6e5}-\\u{6e6}\\u{6ee}-\\u{6fc}\\u{6ff}\\u{710}\\u{712}-\\u{72f}\\u{74d}-\\u{7a5}\\u{7b1}\\u{7c0}-\\u{7ea}\\u{7f4}-\\u{7f5}\\u{7fa}\\u{800}-\\u{815}\\u{81a}\\u{824}\\u{828}\\u{840}-\\u{858}\\u{860}-\\u{86a}\\u{870}-\\u{887}\\u{889}-\\u{88e}\\u{8a0}-\\u{8c9}\\u{904}-\\u{939}\\u{93d}\\u{950}\\u{958}-\\u{961}\\u{966}-\\u{96f}\\u{971}-\\u{980}\\u{985}-\\u{98c}\\u{98f}-\\u{990}\\u{993}-\\u{9a8}\\u{9aa}-\\u{9b0}\\u{9b2}\\u{9b6}-\\u{9b9}\\u{9bd}\\u{9ce}\\u{9dc}-\\u{9dd}\\u{9df}-\\u{9e1}\\u{9e6}-\\u{9f1}\\u{9f4}-\\u{9f9}\\u{9fc}\\u{a05}-\\u{a0a}\\u{a0f}-\\u{a10}\\u{a13}-\\u{a28}\\u{a2a}-\\u{a30}\\u{a32}-\\u{a33}\\u{a35}-\\u{a36}\\u{a38}-\\u{a39}\\u{a59}-\\u{a5c}\\u{a5e}\\u{a66}-\\u{a6f}\\u{a72}-\\u{a74}\\u{a85}-\\u{a8d}\\u{a8f}-\\u{a91}\\u{a93}-\\u{aa8}\\u{aaa}-\\u{ab0}\\u{ab2}-\\u{ab3}\\u{ab5}-\\u{ab9}\\u{abd}\\u{ad0}\\u{ae0}-\\u{ae1}\\u{ae6}-\\u{aef}\\u{af9}\\u{b05}-\\u{b0c}\\u{b0f}-\\u{b10}\\u{b13}-\\u{b28}\\u{b2a}-\\u{b30}\\u{b32}-\\u{b33}\\u{b35}-\\u{b39}\\u{b3d}\\u{b5c}-\\u{b5d}\\u{b5f}-\\u{b61}\\u{b66}-\\u{b6f}\\u{b71}-\\u{b77}\\u{b83}\\u{b85}-\\u{b8a}\\u{b8e}-\\u{b90}\\u{b92}-\\u{b95}\\u{b99}-\\u{b9a}\\u{b9c}\\u{b9e}-\\u{b9f}\\u{ba3}-\\u{ba4}\\u{ba8}-\\u{baa}\\u{bae}-\\u{bb9}\\u{bd0}\\u{be6}-\\u{bf2}\\u{c05}-\\u{c0c}\\u{c0e}-\\u{c10}\\u{c12}-\\u{c28}\\u{c2a}-\\u{c39}\\u{c3d}\\u{c58}-\\u{c5a}\\u{c5d}\\u{c60}-\\u{c61}\\u{c66}-\\u{c6f}\\u{c78}-\\u{c7e}\\u{c80}\\u{c85}-\\u{c8c}\\u{c8e}-\\u{c90}\\u{c92}-\\u{ca8}\\u{caa}-\\u{cb3}\\u{cb5}-\\u{cb9}\\u{cbd}\\u{cdd}-\\u{cde}\\u{ce0}-\\u{ce1}\\u{ce6}-\\u{cef}\\u{cf1}-\\u{cf2}\\u{d04}-\\u{d0c}\\u{d0e}-\\u{d10}\\u{d12}-\\u{d3a}\\u{d3d}\\u{d4e}\\u{d54}-\\u{d56}\\u{d58}-\\u{d61}\\u{d66}-\\u{d78}\\u{d7a}-\\u{d7f}\\u{d85}-\\u{d96}\\u{d9a}-\\u{db1}\\u{db3}-\\u{dbb}\\u{dbd}\\u{dc0}-\\u{dc6}\\u{de6}-\\u{def}\\u{e01}-\\u{e30}\\u{e32}-\\u{e33}\\u{e40}-\\u{e46}\\u{e50}-\\u{e59}\\u{e81}-\\u{e82}\\u{e84}\\u{e86}-\\u{e8a}\\u{e8c}-\\u{ea3}\\u{ea5}\\u{ea7}-\\u{eb0}\\u{eb2}-\\u{eb3}\\u{ebd}\\u{ec0}-\\u{ec4}\\u{ec6}\\u{ed0}-\\u{ed9}\\u{edc}-\\u{edf}\\u{f00}\\u{f20}-\\u{f33}\\u{f40}-\\u{f47}\\u{f49}-\\u{f6c}\\u{f88}-\\u{f8c}\\u{1000}-\\u{102a}\\u{103f}-\\u{1049}\\u{1050}-\\u{1055}\\u{105a}-\\u{105d}\\u{1061}\\u{1065}-\\u{1066}\\u{106e}-\\u{1070}\\u{1075}-\\u{1081}\\u{108e}\\u{1090}-\\u{1099}\\u{10a0}-\\u{10c5}\\u{10c7}\\u{10cd}\\u{10d0}-\\u{10fa}\\u{10fc}-\\u{1248}\\u{124a}-\\u{124d}\\u{1250}-\\u{1256}\\u{1258}\\u{125a}-\\u{125d}\\u{1260}-\\u{1288}\\u{128a}-\\u{128d}\\u{1290}-\\u{12b0}\\u{12b2}-\\u{12b5}\\u{12b8}-\\u{12be}\\u{12c0}\\u{12c2}-\\u{12c5}\\u{12c8}-\\u{12d6}\\u{12d8}-\\u{1310}\\u{1312}-\\u{1315}\\u{1318}-\\u{135a}\\u{1369}-\\u{137c}\\u{1380}-\\u{138f}\\u{13a0}-\\u{13f5}\\u{13f8}-\\u{13fd}\\u{1401}-\\u{166c}\\u{166f}-\\u{167f}\\u{1681}-\\u{169a}\\u{16a0}-\\u{16ea}\\u{16ee}-\\u{16f8}\\u{1700}-\\u{1711}\\u{171f}-\\u{1731}\\u{1740}-\\u{1751}\\u{1760}-\\u{176c}\\u{176e}-\\u{1770}\\u{1780}-\\u{17b3}\\u{17d7}\\u{17dc}\\u{17e0}-\\u{17e9}\\u{17f0}-\\u{17f9}\\u{1810}-\\u{1819}\\u{1820}-\\u{1878}\\u{1880}-\\u{1884}\\u{1887}-\\u{18a8}\\u{18aa}\\u{18b0}-\\u{18f5}\\u{1900}-\\u{191e}\\u{1946}-\\u{196d}\\u{1970}-\\u{1974}\\u{1980}-\\u{19ab}\\u{19b0}-\\u{19c9}\\u{19d0}-\\u{19da}\\u{1a00}-\\u{1a16}\\u{1a20}-\\u{1a54}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1aa7}\\u{1b05}-\\u{1b33}\\u{1b45}-\\u{1b4c}\\u{1b50}-\\u{1b59}\\u{1b83}-\\u{1ba0}\\u{1bae}-\\u{1be5}\\u{1c00}-\\u{1c23}\\u{1c40}-\\u{1c49}\\u{1c4d}-\\u{1c7d}\\u{1c80}-\\u{1c88}\\u{1c90}-\\u{1cba}\\u{1cbd}-\\u{1cbf}\\u{1ce9}-\\u{1cec}\\u{1cee}-\\u{1cf3}\\u{1cf5}-\\u{1cf6}\\u{1cfa}\\u{1d00}-\\u{1dbf}\\u{1e00}-\\u{1f15}\\u{1f18}-\\u{1f1d}\\u{1f20}-\\u{1f45}\\u{1f48}-\\u{1f4d}\\u{1f50}-\\u{1f57}\\u{1f59}\\u{1f5b}\\u{1f5d}\\u{1f5f}-\\u{1f7d}\\u{1f80}-\\u{1fb4}\\u{1fb6}-\\u{1fbc}\\u{1fbe}\\u{1fc2}-\\u{1fc4}\\u{1fc6}-\\u{1fcc}\\u{1fd0}-\\u{1fd3}\\u{1fd6}-\\u{1fdb}\\u{1fe0}-\\u{1fec}\\u{1ff2}-\\u{1ff4}\\u{1ff6}-\\u{1ffc}\\u{2070}-\\u{2071}\\u{2074}-\\u{2079}\\u{207f}-\\u{2089}\\u{2090}-\\u{209c}\\u{2102}\\u{2107}\\u{210a}-\\u{2113}\\u{2115}\\u{2119}-\\u{211d}\\u{2124}\\u{2126}\\u{2128}\\u{212a}-\\u{212d}\\u{212f}-\\u{2139}\\u{213c}-\\u{213f}\\u{2145}-\\u{2149}\\u{214e}\\u{2150}-\\u{2189}\\u{2460}-\\u{249b}\\u{24ea}-\\u{24ff}\\u{2776}-\\u{2793}\\u{2c00}-\\u{2ce4}\\u{2ceb}-\\u{2cee}\\u{2cf2}-\\u{2cf3}\\u{2cfd}\\u{2d00}-\\u{2d25}\\u{2d27}\\u{2d2d}\\u{2d30}-\\u{2d67}\\u{2d6f}\\u{2d80}-\\u{2d96}\\u{2da0}-\\u{2da6}\\u{2da8}-\\u{2dae}\\u{2db0}-\\u{2db6}\\u{2db8}-\\u{2dbe}\\u{2dc0}-\\u{2dc6}\\u{2dc8}-\\u{2dce}\\u{2dd0}-\\u{2dd6}\\u{2dd8}-\\u{2dde}\\u{2e2f}\\u{3005}-\\u{3007}\\u{3021}-\\u{3029}\\u{3031}-\\u{3035}\\u{3038}-\\u{303c}\\u{3041}-\\u{3096}\\u{309d}-\\u{309f}\\u{30a1}-\\u{30fa}\\u{30fc}-\\u{30ff}\\u{3105}-\\u{312f}\\u{3131}-\\u{318e}\\u{3192}-\\u{3195}\\u{31a0}-\\u{31bf}\\u{31f0}-\\u{31ff}\\u{3220}-\\u{3229}\\u{3248}-\\u{324f}\\u{3251}-\\u{325f}\\u{3280}-\\u{3289}\\u{32b1}-\\u{32bf}\\u{3400}-\\u{4dbf}\\u{4e00}-\\u{a48c}\\u{a4d0}-\\u{a4fd}\\u{a500}-\\u{a60c}\\u{a610}-\\u{a62b}\\u{a640}-\\u{a66e}\\u{a67f}-\\u{a69d}\\u{a6a0}-\\u{a6ef}\\u{a717}-\\u{a71f}\\u{a722}-\\u{a788}\\u{a78b}-\\u{a7ca}\\u{a7d0}-\\u{a7d1}\\u{a7d3}\\u{a7d5}-\\u{a7d9}\\u{a7f2}-\\u{a801}\\u{a803}-\\u{a805}\\u{a807}-\\u{a80a}\\u{a80c}-\\u{a822}\\u{a830}-\\u{a835}\\u{a840}-\\u{a873}\\u{a882}-\\u{a8b3}\\u{a8d0}-\\u{a8d9}\\u{a8f2}-\\u{a8f7}\\u{a8fb}\\u{a8fd}-\\u{a8fe}\\u{a900}-\\u{a925}\\u{a930}-\\u{a946}\\u{a960}-\\u{a97c}\\u{a984}-\\u{a9b2}\\u{a9cf}-\\u{a9d9}\\u{a9e0}-\\u{a9e4}\\u{a9e6}-\\u{a9fe}\\u{aa00}-\\u{aa28}\\u{aa40}-\\u{aa42}\\u{aa44}-\\u{aa4b}\\u{aa50}-\\u{aa59}\\u{aa60}-\\u{aa76}\\u{aa7a}\\u{aa7e}-\\u{aaaf}\\u{aab1}\\u{aab5}-\\u{aab6}\\u{aab9}-\\u{aabd}\\u{aac0}\\u{aac2}\\u{aadb}-\\u{aadd}\\u{aae0}-\\u{aaea}\\u{aaf2}-\\u{aaf4}\\u{ab01}-\\u{ab06}\\u{ab09}-\\u{ab0e}\\u{ab11}-\\u{ab16}\\u{ab20}-\\u{ab26}\\u{ab28}-\\u{ab2e}\\u{ab30}-\\u{ab5a}\\u{ab5c}-\\u{ab69}\\u{ab70}-\\u{abe2}\\u{abf0}-\\u{abf9}\\u{ac00}-\\u{d7a3}\\u{d7b0}-\\u{d7c6}\\u{d7cb}-\\u{d7fb}\\u{f900}-\\u{fa6d}\\u{fa70}-\\u{fad9}\\u{fb00}-\\u{fb06}\\u{fb13}-\\u{fb17}\\u{fb1d}\\u{fb1f}-\\u{fb28}\\u{fb2a}-\\u{fb36}\\u{fb38}-\\u{fb3c}\\u{fb3e}\\u{fb40}-\\u{fb41}\\u{fb43}-\\u{fb44}\\u{fb46}-\\u{fbb1}\\u{fbd3}-\\u{fd3d}\\u{fd50}-\\u{fd8f}\\u{fd92}-\\u{fdc7}\\u{fdf0}-\\u{fdfb}\\u{fe70}-\\u{fe74}\\u{fe76}-\\u{fefc}\\u{ff10}-\\u{ff19}\\u{ff21}-\\u{ff3a}\\u{ff41}-\\u{ff5a}\\u{ff66}-\\u{ffbe}\\u{ffc2}-\\u{ffc7}\\u{ffca}-\\u{ffcf}\\u{ffd2}-\\u{ffd7}\\u{ffda}-\\u{ffdc}\\u{10000}-\\u{1000b}\\u{1000d}-\\u{10026}\\u{10028}-\\u{1003a}\\u{1003c}-\\u{1003d}\\u{1003f}-\\u{1004d}\\u{10050}-\\u{1005d}\\u{10080}-\\u{100fa}\\u{10107}-\\u{10133}\\u{10140}-\\u{10178}\\u{1018a}-\\u{1018b}\\u{10280}-\\u{1029c}\\u{102a0}-\\u{102d0}\\u{102e1}-\\u{102fb}\\u{10300}-\\u{10323}\\u{1032d}-\\u{1034a}\\u{10350}-\\u{10375}\\u{10380}-\\u{1039d}\\u{103a0}-\\u{103c3}\\u{103c8}-\\u{103cf}\\u{103d1}-\\u{103d5}\\u{10400}-\\u{1049d}\\u{104a0}-\\u{104a9}\\u{104b0}-\\u{104d3}\\u{104d8}-\\u{104fb}\\u{10500}-\\u{10527}\\u{10530}-\\u{10563}\\u{10570}-\\u{1057a}\\u{1057c}-\\u{1058a}\\u{1058c}-\\u{10592}\\u{10594}-\\u{10595}\\u{10597}-\\u{105a1}\\u{105a3}-\\u{105b1}\\u{105b3}-\\u{105b9}\\u{105bb}-\\u{105bc}\\u{10600}-\\u{10736}\\u{10740}-\\u{10755}\\u{10760}-\\u{10767}\\u{10780}-\\u{10785}\\u{10787}-\\u{107b0}\\u{107b2}-\\u{107ba}\\u{10800}-\\u{10805}\\u{10808}\\u{1080a}-\\u{10835}\\u{10837}-\\u{10838}\\u{1083c}\\u{1083f}-\\u{10855}\\u{10858}-\\u{10876}\\u{10879}-\\u{1089e}\\u{108a7}-\\u{108af}\\u{108e0}-\\u{108f2}\\u{108f4}-\\u{108f5}\\u{108fb}-\\u{1091b}\\u{10920}-\\u{10939}\\u{10980}-\\u{109b7}\\u{109bc}-\\u{109cf}\\u{109d2}-\\u{10a00}\\u{10a10}-\\u{10a13}\\u{10a15}-\\u{10a17}\\u{10a19}-\\u{10a35}\\u{10a40}-\\u{10a48}\\u{10a60}-\\u{10a7e}\\u{10a80}-\\u{10a9f}\\u{10ac0}-\\u{10ac7}\\u{10ac9}-\\u{10ae4}\\u{10aeb}-\\u{10aef}\\u{10b00}-\\u{10b35}\\u{10b40}-\\u{10b55}\\u{10b58}-\\u{10b72}\\u{10b78}-\\u{10b91}\\u{10ba9}-\\u{10baf}\\u{10c00}-\\u{10c48}\\u{10c80}-\\u{10cb2}\\u{10cc0}-\\u{10cf2}\\u{10cfa}-\\u{10d23}\\u{10d30}-\\u{10d39}\\u{10e60}-\\u{10e7e}\\u{10e80}-\\u{10ea9}\\u{10eb0}-\\u{10eb1}\\u{10f00}-\\u{10f27}\\u{10f30}-\\u{10f45}\\u{10f51}-\\u{10f54}\\u{10f70}-\\u{10f81}\\u{10fb0}-\\u{10fcb}\\u{10fe0}-\\u{10ff6}\\u{11003}-\\u{11037}\\u{11052}-\\u{1106f}\\u{11071}-\\u{11072}\\u{11075}\\u{11083}-\\u{110af}\\u{110d0}-\\u{110e8}\\u{110f0}-\\u{110f9}\\u{11103}-\\u{11126}\\u{11136}-\\u{1113f}\\u{11144}\\u{11147}\\u{11150}-\\u{11172}\\u{11176}\\u{11183}-\\u{111b2}\\u{111c1}-\\u{111c4}\\u{111d0}-\\u{111da}\\u{111dc}\\u{111e1}-\\u{111f4}\\u{11200}-\\u{11211}\\u{11213}-\\u{1122b}\\u{1123f}-\\u{11240}\\u{11280}-\\u{11286}\\u{11288}\\u{1128a}-\\u{1128d}\\u{1128f}-\\u{1129d}\\u{1129f}-\\u{112a8}\\u{112b0}-\\u{112de}\\u{112f0}-\\u{112f9}\\u{11305}-\\u{1130c}\\u{1130f}-\\u{11310}\\u{11313}-\\u{11328}\\u{1132a}-\\u{11330}\\u{11332}-\\u{11333}\\u{11335}-\\u{11339}\\u{1133d}\\u{11350}\\u{1135d}-\\u{11361}\\u{11400}-\\u{11434}\\u{11447}-\\u{1144a}\\u{11450}-\\u{11459}\\u{1145f}-\\u{11461}\\u{11480}-\\u{114af}\\u{114c4}-\\u{114c5}\\u{114c7}\\u{114d0}-\\u{114d9}\\u{11580}-\\u{115ae}\\u{115d8}-\\u{115db}\\u{11600}-\\u{1162f}\\u{11644}\\u{11650}-\\u{11659}\\u{11680}-\\u{116aa}\\u{116b8}\\u{116c0}-\\u{116c9}\\u{11700}-\\u{1171a}\\u{11730}-\\u{1173b}\\u{11740}-\\u{11746}\\u{11800}-\\u{1182b}\\u{118a0}-\\u{118f2}\\u{118ff}-\\u{11906}\\u{11909}\\u{1190c}-\\u{11913}\\u{11915}-\\u{11916}\\u{11918}-\\u{1192f}\\u{1193f}\\u{11941}\\u{11950}-\\u{11959}\\u{119a0}-\\u{119a7}\\u{119aa}-\\u{119d0}\\u{119e1}\\u{119e3}\\u{11a00}\\u{11a0b}-\\u{11a32}\\u{11a3a}\\u{11a50}\\u{11a5c}-\\u{11a89}\\u{11a9d}\\u{11ab0}-\\u{11af8}\\u{11c00}-\\u{11c08}\\u{11c0a}-\\u{11c2e}\\u{11c40}\\u{11c50}-\\u{11c6c}\\u{11c72}-\\u{11c8f}\\u{11d00}-\\u{11d06}\\u{11d08}-\\u{11d09}\\u{11d0b}-\\u{11d30}\\u{11d46}\\u{11d50}-\\u{11d59}\\u{11d60}-\\u{11d65}\\u{11d67}-\\u{11d68}\\u{11d6a}-\\u{11d89}\\u{11d98}\\u{11da0}-\\u{11da9}\\u{11ee0}-\\u{11ef2}\\u{11f02}\\u{11f04}-\\u{11f10}\\u{11f12}-\\u{11f33}\\u{11f50}-\\u{11f59}\\u{11fb0}\\u{11fc0}-\\u{11fd4}\\u{12000}-\\u{12399}\\u{12400}-\\u{1246e}\\u{12480}-\\u{12543}\\u{12f90}-\\u{12ff0}\\u{13000}-\\u{1342f}\\u{13441}-\\u{13446}\\u{14400}-\\u{14646}\\u{16800}-\\u{16a38}\\u{16a40}-\\u{16a5e}\\u{16a60}-\\u{16a69}\\u{16a70}-\\u{16abe}\\u{16ac0}-\\u{16ac9}\\u{16ad0}-\\u{16aed}\\u{16b00}-\\u{16b2f}\\u{16b40}-\\u{16b43}\\u{16b50}-\\u{16b59}\\u{16b5b}-\\u{16b61}\\u{16b63}-\\u{16b77}\\u{16b7d}-\\u{16b8f}\\u{16e40}-\\u{16e96}\\u{16f00}-\\u{16f4a}\\u{16f50}\\u{16f93}-\\u{16f9f}\\u{16fe0}-\\u{16fe1}\\u{16fe3}\\u{17000}-\\u{187f7}\\u{18800}-\\u{18cd5}\\u{18d00}-\\u{18d08}\\u{1aff0}-\\u{1aff3}\\u{1aff5}-\\u{1affb}\\u{1affd}-\\u{1affe}\\u{1b000}-\\u{1b122}\\u{1b132}\\u{1b150}-\\u{1b152}\\u{1b155}\\u{1b164}-\\u{1b167}\\u{1b170}-\\u{1b2fb}\\u{1bc00}-\\u{1bc6a}\\u{1bc70}-\\u{1bc7c}\\u{1bc80}-\\u{1bc88}\\u{1bc90}-\\u{1bc99}\\u{1d2c0}-\\u{1d2d3}\\u{1d2e0}-\\u{1d2f3}\\u{1d360}-\\u{1d378}\\u{1d400}-\\u{1d454}\\u{1d456}-\\u{1d49c}\\u{1d49e}-\\u{1d49f}\\u{1d4a2}\\u{1d4a5}-\\u{1d4a6}\\u{1d4a9}-\\u{1d4ac}\\u{1d4ae}-\\u{1d4b9}\\u{1d4bb}\\u{1d4bd}-\\u{1d4c3}\\u{1d4c5}-\\u{1d505}\\u{1d507}-\\u{1d50a}\\u{1d50d}-\\u{1d514}\\u{1d516}-\\u{1d51c}\\u{1d51e}-\\u{1d539}\\u{1d53b}-\\u{1d53e}\\u{1d540}-\\u{1d544}\\u{1d546}\\u{1d54a}-\\u{1d550}\\u{1d552}-\\u{1d6a5}\\u{1d6a8}-\\u{1d6c0}\\u{1d6c2}-\\u{1d6da}\\u{1d6dc}-\\u{1d6fa}\\u{1d6fc}-\\u{1d714}\\u{1d716}-\\u{1d734}\\u{1d736}-\\u{1d74e}\\u{1d750}-\\u{1d76e}\\u{1d770}-\\u{1d788}\\u{1d78a}-\\u{1d7a8}\\u{1d7aa}-\\u{1d7c2}\\u{1d7c4}-\\u{1d7cb}\\u{1d7ce}-\\u{1d7ff}\\u{1df00}-\\u{1df1e}\\u{1df25}-\\u{1df2a}\\u{1e030}-\\u{1e06d}\\u{1e100}-\\u{1e12c}\\u{1e137}-\\u{1e13d}\\u{1e140}-\\u{1e149}\\u{1e14e}\\u{1e290}-\\u{1e2ad}\\u{1e2c0}-\\u{1e2eb}\\u{1e2f0}-\\u{1e2f9}\\u{1e4d0}-\\u{1e4eb}\\u{1e4f0}-\\u{1e4f9}\\u{1e7e0}-\\u{1e7e6}\\u{1e7e8}-\\u{1e7eb}\\u{1e7ed}-\\u{1e7ee}\\u{1e7f0}-\\u{1e7fe}\\u{1e800}-\\u{1e8c4}\\u{1e8c7}-\\u{1e8cf}\\u{1e900}-\\u{1e943}\\u{1e94b}\\u{1e950}-\\u{1e959}\\u{1ec71}-\\u{1ecab}\\u{1ecad}-\\u{1ecaf}\\u{1ecb1}-\\u{1ecb4}\\u{1ed01}-\\u{1ed2d}\\u{1ed2f}-\\u{1ed3d}\\u{1ee00}-\\u{1ee03}\\u{1ee05}-\\u{1ee1f}\\u{1ee21}-\\u{1ee22}\\u{1ee24}\\u{1ee27}\\u{1ee29}-\\u{1ee32}\\u{1ee34}-\\u{1ee37}\\u{1ee39}\\u{1ee3b}\\u{1ee42}\\u{1ee47}\\u{1ee49}\\u{1ee4b}\\u{1ee4d}-\\u{1ee4f}\\u{1ee51}-\\u{1ee52}\\u{1ee54}\\u{1ee57}\\u{1ee59}\\u{1ee5b}\\u{1ee5d}\\u{1ee5f}\\u{1ee61}-\\u{1ee62}\\u{1ee64}\\u{1ee67}-\\u{1ee6a}\\u{1ee6c}-\\u{1ee72}\\u{1ee74}-\\u{1ee77}\\u{1ee79}-\\u{1ee7c}\\u{1ee7e}\\u{1ee80}-\\u{1ee89}\\u{1ee8b}-\\u{1ee9b}\\u{1eea1}-\\u{1eea3}\\u{1eea5}-\\u{1eea9}\\u{1eeab}-\\u{1eebb}\\u{1f100}-\\u{1f10c}\\u{1fbf0}-\\u{1fbf9}\\u{20000}-\\u{2a6df}\\u{2a700}-\\u{2b739}\\u{2b740}-\\u{2b81d}\\u{2b820}-\\u{2cea1}\\u{2ceb0}-\\u{2ebe0}\\u{2ebf0}-\\u{2ee5d}\\u{2f800}-\\u{2fa1d}\\u{30000}-\\u{3134a}\\u{31350}-\\u{323af} ,._:'–-]+(?=\\n?$)","type":["string","null"]},"collection_date":{"pattern":"(?:[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?)?|NA)","type":["string","null"]},"drug_usage":{"items":{"pattern":"^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)","type":"string"},"type":["array","null"]},"env_broad_scale":{"pattern":"^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"env_local_scale":{"pattern":"^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"env_medium":{"pattern":"^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"geo_admin1":{"type":["string","null"]},"geo_admin2":{"type":["string","null"]},"geo_admin3":{"type":["string","null"]},"gravid":{"type":["boolean","null"]},"gravidity":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":["integer","null"]},"has_travel_out_six_month":{"type":["boolean","null"]},"host_age":{"minimum":0,"pattern":"^[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]*\\.?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+(?=\\n?$)","type":["number","null"]},"host_sex":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":["string","null"]},"host_subject_name":{"minimum":0,"type":["string","null"]},"host_taxon_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":["integer","null"]},"lat_lon":{"pattern":"^[-+]?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{1,2}(?:\\.[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+)?,[-+]?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{1,3}(?:\\.[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+)?(?=\\n?$)","type":["string","null"]},"parasite_density_info":{"items":{"$ref":"#/$defs/ParasiteDensity"},"type":["array","null"]},"project_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":["integer","null"]},"specimen_accession":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":["string","null"]},"specimen_collect_device":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"specimen_comments":{"items":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":"string"},"type":["array","null"]},"specimen_name":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":"string"},"specimen_store_loc":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"specimen_taxon_id":{"items":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"type":["array","null"]},"specimen_type":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"storage_plate_info":{"anyOf":[{"$ref":"#/$defs/PlateInfo"},{"type":"null"}]},"travel_out_six_month":{"items":{"$ref":"#/$defs/TravelInfo"},"type":["array","null"]},"treatment_status":{"items":{"pattern":"^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)","type":"string"},"type":["array","null"]}},"required":["specimen_name"],"type":"object"},"StageReadCounts":{"additionalProperties":true,"properties":{"reads":{"minimum":0,"type":"integer"},"stage":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"}},"required":["reads","stage"],"type":"object"},"TargetInfo":{"additionalProperties":true,"properties":{"forward_primer":{"$ref":"#/$defs/PrimerInfo"},"gene_name":{"pattern":"^[A-z-._0-9:]+(?=\\n?$)","type":["string","null"]},"insert_location":{"anyOf":[{"$ref":"#/$defs/GenomicLocation"},{"type":"null"}]},"markers_of_interest":{"items":{"$ref":"#/$defs/MarkerOfInterest"},"type":["array","null"]},"reverse_primer":{"$ref":"#/$defs/PrimerInfo"},"target_attributes":{"items":{"type":"string"},"type":["array","null"]},"target_name":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"}},"required":["target_name","forward_primer","reverse_primer"],"type":"object"},"TravelInfo":{"additionalProperties":true,"properties":{"bed_net_usage":{"minimum":0,"type":["number","null"]},"geo_admin1":{"type":["string","null"]},"geo_admin2":{"type":["string","null"]},"geo_admin3":{"type":["string","null"]},"lat_lon":{"pattern":"^[-+]?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{1,2}(?:\\.[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+)?,[-+]?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{1,3}(?:\\.[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+)?(?=\\n?$)","type":["string","null"]},"travel_country":{"pattern":"^[\\u{30}-\\u{39}\\u{41}-\\u{5a}\\u{5f}\\u{61}-\\u{7a}\\u{aa}\\u{b2}-\\u{b3}\\u{b5}\\u{b9}-\\u{ba}\\u{bc}-\\u{be}\\u{c0}-\\u{d6}\\u{d8}-\\u{f6}\\u{f8}-\\u{2c1}\\u{2c6}-\\u{2d1}\\u{2e0}-\\u{2e4}\\u{2ec}\\u{2ee}\\u{370}-\\u{374}\\u{376}-\\u{377}\\u{37a}-\\u{37d}\\u{37f}\\u{386}\\u{388}-\\u{38a}\\u{38c}\\u{38e}-\\u{3a1}\\u{3a3}-\\u{3f5}\\u{3f7}-\\u{481}\\u{48a}-\\u{52f}\\u{531}-\\u{556}\\u{559}\\u{560}-\\u{588}\\u{5d0}-\\u{5ea}\\u{5ef}-\\u{5f2}\\u{620}-\\u{64a}\\u{660}-\\u{669}\\u{66e}-\\u{66f}\\u{671}-\\u{6d3}\\u{6d5}\\u{6e5}-\\u{6e6}\\u{6ee}-\\u{6fc}\\u{6ff}\\u{710}\\u{712}-\\u{72f}\\u{74d}-\\u{7a5}\\u{7b1}\\u{7c0}-\\u{7ea}\\u{7f4}-\\u{7f5}\\u{7fa}\\u{800}-\\u{815}\\u{81a}\\u{824}\\u{828}\\u{840}-\\u{858}\\u{860}-\\u{86a}\\u{870}-\\u{887}\\u{889}-\\u{88e}\\u{8a0}-\\u{8c9}\\u{904}-\\u{939}\\u{93d}\\u{950}\\u{958}-\\u{961}\\u{966}-\\u{96f}\\u{971}-\\u{980}\\u{985}-\\u{98c}\\u{98f}-\\u{990}\\u{993}-\\u{9a8}\\u{9aa}-\\u{9b0}\\u{9b2}\\u{9b6}-\\u{9b9}\\u{9bd}\\u{9ce}\\u{9dc}-\\u{9dd}\\u{9df}-\\u{9e1}\\u{9e6}-\\u{9f1}\\u{9f4}-\\u{9f9}\\u{9fc}\\u{a05}-\\u{a0a}\\u{a0f}-\\u{a10}\\u{a13}-\\u{a28}\\u{a2a}-\\u{a30}\\u{a32}-\\u{a33}\\u{a35}-\\u{a36}\\u{a38}-\\u{a39}\\u{a59}-\\u{a5c}\\u{a5e}\\u{a66}-\\u{a6f}\\u{a72}-\\u{a74}\\u{a85}-\\u{a8d}\\u{a8f}-\\u{a91}\\u{a93}-\\u{aa8}\\u{aaa}-\\u{ab0}\\u{ab2}-\\u{ab3}\\u{ab5}-\\u{ab9}\\u{abd}\\u{ad0}\\u{ae0}-\\u{ae1}\\u{ae6}-\\u{aef}\\u{af9}\\u{b05}-\\u{b0c}\\u{b0f}-\\u{b10}\\u{b13}-\\u{b28}\\u{b2a}-\\u{b30}\\u{b32}-\\u{b33}\\u{b35}-\\u{b39}\\u{b3d}\\u{b5c}-\\u{b5d}\\u{b5f}-\\u{b61}\\u{b66}-\\u{b6f}\\u{b71}-\\u{b77}\\u{b83}\\u{b85}-\\u{b8a}\\u{b8e}-\\u{b90}\\u{b92}-\\u{b95}\\u{b99}-\\u{b9a}\\u{b9c}\\u{b9e}-\\u{b9f}\\u{ba3}-\\u{ba4}\\u{ba8}-\\u{baa}\\u{bae}-\\u{bb9}\\u{bd0}\\u{be6}-\\u{bf2}\\u{c05}-\\u{c0c}\\u{c0e}-\\u{c10}\\u{c12}-\\u{c28}\\u{c2a}-\\u{c39}\\u{c3d}\\u{c58}-\\u{c5a}\\u{c5d}\\u{c60}-\\u{c61}\\u{c66}-\\u{c6f}\\u{c78}-\\u{c7e}\\u{c80}\\u{c85}-\\u{c8c}\\u{c8e}-\\u{c90}\\u{c92}-\\u{ca8}\\u{caa}-\\u{cb3}\\u{cb5}-\\u{cb9}\\u{cbd}\\u{cdd}-\\u{cde}\\u{ce0}-\\u{ce1}\\u{ce6}-\\u{cef}\\u{cf1}-\\u{cf2}\\u{d04}-\\u{d0c}\\u{d0e}-\\u{d10}\\u{d12}-\\u{d3a}\\u{d3d}\\u{d4e}\\u{d54}-\\u{d56}\\u{d58}-\\u{d61}\\u{d66}-\\u{d78}\\u{d7a}-\\u{d7f}\\u{d85}-\\u{d96}\\u{d9a}-\\u{db1}\\u{db3}-\\u{dbb}\\u{dbd}\\u{dc0}-\\u{dc6}\\u{de6}-\\u{def}\\u{e01}-\\u{e30}\\u{e32}-\\u{e33}\\u{e40}-\\u{e46}\\u{e50}-\\u{e59}\\u{e81}-\\u{e82}\\u{e84}\\u{e86}-\\u{e8a}\\u{e8c}-\\u{ea3}\\u{ea5}\\u{ea7}-\\u{eb0}\\u{eb2}-\\u{eb3}\\u{ebd}\\u{ec0}-\\u{ec4}\\u{ec6}\\u{ed0}-\\u{ed9}\\u{edc}-\\u{edf}\\u{f00}\\u{f20}-\\u{f33}\\u{f40}-\\u{f47}\\u{f49}-\\u{f6c}\\u{f88}-\\u{f8c}\\u{1000}-\\u{102a}\\u{103f}-\\u{1049}\\u{1050}-\\u{1055}\\u{105a}-\\u{105d}\\u{1061}\\u{1065}-\\u{1066}\\u{106e}-\\u{1070}\\u{1075}-\\u{1081}\\u{108e}\\u{1090}-\\u{1099}\\u{10a0}-\\u{10c5}\\u{10c7}\\u{10cd}\\u{10d0}-\\u{10fa}\\u{10fc}-\\u{1248}\\u{124a}-\\u{124d}\\u{1250}-\\u{1256}\\u{1258}\\u{125a}-\\u{125d}\\u{1260}-\\u{1288}\\u{128a}-\\u{128d}\\u{1290}-\\u{12b0}\\u{12b2}-\\u{12b5}\\u{12b8}-\\u{12be}\\u{12c0}\\u{12c2}-\\u{12c5}\\u{12c8}-\\u{12d6}\\u{12d8}-\\u{1310}\\u{1312}-\\u{1315}\\u{1318}-\\u{135a}\\u{1369}-\\u{137c}\\u{1380}-\\u{138f}\\u{13a0}-\\u{13f5}\\u{13f8}-\\u{13fd}\\u{1401}-\\u{166c}\\u{166f}-\\u{167f}\\u{1681}-\\u{169a}\\u{16a0}-\\u{16ea}\\u{16ee}-\\u{16f8}\\u{1700}-\\u{1711}\\u{171f}-\\u{1731}\\u{1740}-\\u{1751}\\u{1760}-\\u{176c}\\u{176e}-\\u{1770}\\u{1780}-\\u{17b3}\\u{17d7}\\u{17dc}\\u{17e0}-\\u{17e9}\\u{17f0}-\\u{17f9}\\u{1810}-\\u{1819}\\u{1820}-\\u{1878}\\u{1880}-\\u{1884}\\u{1887}-\\u{18a8}\\u{18aa}\\u{18b0}-\\u{18f5}\\u{1900}-\\u{191e}\\u{1946}-\\u{196d}\\u{1970}-\\u{1974}\\u{1980}-\\u{19ab}\\u{19b0}-\\u{19c9}\\u{19d0}-\\u{19da}\\u{1a00}-\\u{1a16}\\u{1a20}-\\u{1a54}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1aa7}\\u{1b05}-\\u{1b33}\\u{1b45}-\\u{1b4c}\\u{1b50}-\\u{1b59}\\u{1b83}-\\u{1ba0}\\u{1bae}-\\u{1be5}\\u{1c00}-\\u{1c23}\\u{1c40}-\\u{1c49}\\u{1c4d}-\\u{1c7d}\\u{1c80}-\\u{1c88}\\u{1c90}-\\u{1cba}\\u{1cbd}-\\u{1cbf}\\u{1ce9}-\\u{1cec}\\u{1cee}-\\u{1cf3}\\u{1cf5}-\\u{1cf6}\\u{1cfa}\\u{1d00}-\\u{1dbf}\\u{1e00}-\\u{1f15}\\u{1f18}-\\u{1f1d}\\u{1f20}-\\u{1f45}\\u{1f48}-\\u{1f4d}\\u{1f50}-\\u{1f57}\\u{1f59}\\u{1f5b}\\u{1f5d}\\u{1f5f}-\\u{1f7d}\\u{1f80}-\\u{1fb4}\\u{1fb6}-\\u{1fbc}\\u{1fbe}\\u{1fc2}-\\u{1fc4}\\u{1fc6}-\\u{1fcc}\\u{1fd0}-\\u{1fd3}\\u{1fd6}-\\u{1fdb}\\u{1fe0}-\\u{1fec}\\u{1ff2}-\\u{1ff4}\\u{1ff6}-\\u{1ffc}\\u{2070}-\\u{2071}\\u{2074}-\\u{2079}\\u{207f}-\\u{2089}\\u{2090}-\\u{209c}\\u{2102}\\u{2107}\\u{210a}-\\u{2113}\\u{2115}\\u{2119}-\\u{211d}\\u{2124}\\u{2126}\\u{2128}\\u{212a}-\\u{212d}\\u{212f}-\\u{2139}\\u{213c}-\\u{213f}\\u{2145}-\\u{2149}\\u{214e}\\u{2150}-\\u{2189}\\u{2460}-\\u{249b}\\u{24ea}-\\u{24ff}\\u{2776}-\\u{2793}\\u{2c00}-\\u{2ce4}\\u{2ceb}-\\u{2cee}\\u{2cf2}-\\u{2cf3}\\u{2cfd}\\u{2d00}-\\u{2d25}\\u{2d27}\\u{2d2d}\\u{2d30}-\\u{2d67}\\u{2d6f}\\u{2d80}-\\u{2d96}\\u{2da0}-\\u{2da6}\\u{2da8}-\\u{2dae}\\u{2db0}-\\u{2db6}\\u{2db8}-\\u{2dbe}\\u{2dc0}-\\u{2dc6}\\u{2dc8}-\\u{2dce}\\u{2dd0}-\\u{2dd6}\\u{2dd8}-\\u{2dde}\\u{2e2f}\\u{3005}-\\u{3007}\\u{3021}-\\u{3029}\\u{3031}-\\u{3035}\\u{3038}-\\u{303c}\\u{3041}-\\u{3096}\\u{309d}-\\u{309f}\\u{30a1}-\\u{30fa}\\u{30fc}-\\u{30ff}\\u{3105}-\\u{312f}\\u{3131}-\\u{318e}\\u{3192}-\\u{3195}\\u{31a0}-\\u{31bf}\\u{31f0}-\\u{31ff}\\u{3220}-\\u{3229}\\u{3248}-\\u{324f}\\u{3251}-\\u{325f}\\u{3280}-\\u{3289}\\u{32b1}-\\u{32bf}\\u{3400}-\\u{4dbf}\\u{4e00}-\\u{a48c}\\u{a4d0}-\\u{a4fd}\\u{a500}-\\u{a60c}\\u{a610}-\\u{a62b}\\u{a640}-\\u{a66e}\\u{a67f}-\\u{a69d}\\u{a6a0}-\\u{a6ef}\\u{a717}-\\u{a71f}\\u{a722}-\\u{a788}\\u{a78b}-\\u{a7ca}\\u{a7d0}-\\u{a7d1}\\u{a7d3}\\u{a7d5}-\\u{a7d9}\\u{a7f2}-\\u{a801}\\u{a803}-\\u{a805}\\u{a807}-\\u{a80a}\\u{a80c}-\\u{a822}\\u{a830}-\\u{a835}\\u{a840}-\\u{a873}\\u{a882}-\\u{a8b3}\\u{a8d0}-\\u{a8d9}\\u{a8f2}-\\u{a8f7}\\u{a8fb}\\u{a8fd}-\\u{a8fe}\\u{a900}-\\u{a925}\\u{a930}-\\u{a946}\\u{a960}-\\u{a97c}\\u{a984}-\\u{a9b2}\\u{a9cf}-\\u{a9d9}\\u{a9e0}-\\u{a9e4}\\u{a9e6}-\\u{a9fe}\\u{aa00}-\\u{aa28}\\u{aa40}-\\u{aa42}\\u{aa44}-\\u{aa4b}\\u{aa50}-\\u{aa59}\\u{aa60}-\\u{aa76}\\u{aa7a}\\u{aa7e}-\\u{aaaf}\\u{aab1}\\u{aab5}-\\u{aab6}\\u{aab9}-\\u{aabd}\\u{aac0}\\u{aac2}\\u{aadb}-\\u{aadd}\\u{aae0}-\\u{aaea}\\u{aaf2}-\\u{aaf4}\\u{ab01}-\\u{ab06}\\u{ab09}-\\u{ab0e}\\u{ab11}-\\u{ab16}\\u{ab20}-\\u{ab26}\\u{ab28}-\\u{ab2e}\\u{ab30}-\\u{ab5a}\\u{ab5c}-\\u{ab69}\\u{ab70}-\\u{abe2}\\u{abf0}-\\u{abf9}\\u{ac00}-\\u{d7a3}\\u{d7b0}-\\u{d7c6}\\u{d7cb}-\\u{d7fb}\\u{f900}-\\u{fa6d}\\u{fa70}-\\u{fad9}\\u{fb00}-\\u{fb06}\\u{fb13}-\\u{fb17}\\u{fb1d}\\u{fb1f}-\\u{fb28}\\u{fb2a}-\\u{fb36}\\u{fb38}-\\u{fb3c}\\u{fb3e}\\u{fb40}-\\u{fb41}\\u{fb43}-\\u{fb44}\\u{fb46}-\\u{fbb1}\\u{fbd3}-\\u{fd3d}\\u{fd50}-\\u{fd8f}\\u{fd92}-\\u{fdc7}\\u{fdf0}-\\u{fdfb}\\u{fe70}-\\u{fe74}\\u{fe76}-\\u{fefc}\\u{ff10}-\\u{ff19}\\u{ff21}-\\u{ff3a}\\u{ff41}-\\u{ff5a}\\u{ff66}-\\u{ffbe}\\u{ffc2}-\\u{ffc7}\\u{ffca}-\\u{ffcf}\\u{ffd2}-\\u{ffd7}\\u{ffda}-\\u{ffdc}\\u{10000}-\\u{1000b}\\u{1000d}-\\u{10026}\\u{10028}-\\u{1003a}\\u{1003c}-\\u{1003d}\\u{1003f}-\\u{1004d}\\u{10050}-\\u{1005d}\\u{10080}-\\u{100fa}\\u{10107}-\\u{10133}\\u{10140}-\\u{10178}\\u{1018a}-\\u{1018b}\\u{10280}-\\u{1029c}\\u{102a0}-\\u{102d0}\\u{102e1}-\\u{102fb}\\u{10300}-\\u{10323}\\u{1032d}-\\u{1034a}\\u{10350}-\\u{10375}\\u{10380}-\\u{1039d}\\u{103a0}-\\u{103c3}\\u{103c8}-\\u{103cf}\\u{103d1}-\\u{103d5}\\u{10400}-\\u{1049d}\\u{104a0}-\\u{104a9}\\u{104b0}-\\u{104d3}\\u{104d8}-\\u{104fb}\\u{10500}-\\u{10527}\\u{10530}-\\u{10563}\\u{10570}-\\u{1057a}\\u{1057c}-\\u{1058a}\\u{1058c}-\\u{10592}\\u{10594}-\\u{10595}\\u{10597}-\\u{105a1}\\u{105a3}-\\u{105b1}\\u{105b3}-\\u{105b9}\\u{105bb}-\\u{105bc}\\u{10600}-\\u{10736}\\u{10740}-\\u{10755}\\u{10760}-\\u{10767}\\u{10780}-\\u{10785}\\u{10787}-\\u{107b0}\\u{107b2}-\\u{107ba}\\u{10800}-\\u{10805}\\u{10808}\\u{1080a}-\\u{10835}\\u{10837}-\\u{10838}\\u{1083c}\\u{1083f}-\\u{10855}\\u{10858}-\\u{10876}\\u{10879}-\\u{1089e}\\u{108a7}-\\u{108af}\\u{108e0}-\\u{108f2}\\u{108f4}-\\u{108f5}\\u{108fb}-\\u{1091b}\\u{10920}-\\u{10939}\\u{10980}-\\u{109b7}\\u{109bc}-\\u{109cf}\\u{109d2}-\\u{10a00}\\u{10a10}-\\u{10a13}\\u{10a15}-\\u{10a17}\\u{10a19}-\\u{10a35}\\u{10a40}-\\u{10a48}\\u{10a60}-\\u{10a7e}\\u{10a80}-\\u{10a9f}\\u{10ac0}-\\u{10ac7}\\u{10ac9}-\\u{10ae4}\\u{10aeb}-\\u{10aef}\\u{10b00}-\\u{10b35}\\u{10b40}-\\u{10b55}\\u{10b58}-\\u{10b72}\\u{10b78}-\\u{10b91}\\u{10ba9}-\\u{10baf}\\u{10c00}-\\u{10c48}\\u{10c80}-\\u{10cb2}\\u{10cc0}-\\u{10cf2}\\u{10cfa}-\\u{10d23}\\u{10d30}-\\u{10d39}\\u{10e60}-\\u{10e7e}\\u{10e80}-\\u{10ea9}\\u{10eb0}-\\u{10eb1}\\u{10f00}-\\u{10f27}\\u{10f30}-\\u{10f45}\\u{10f51}-\\u{10f54}\\u{10f70}-\\u{10f81}\\u{10fb0}-\\u{10fcb}\\u{10fe0}-\\u{10ff6}\\u{11003}-\\u{11037}\\u{11052}-\\u{1106f}\\u{11071}-\\u{11072}\\u{11075}\\u{11083}-\\u{110af}\\u{110d0}-\\u{110e8}\\u{110f0}-\\u{110f9}\\u{11103}-\\u{11126}\\u{11136}-\\u{1113f}\\u{11144}\\u{11147}\\u{11150}-\\u{11172}\\u{11176}\\u{11183}-\\u{111b2}\\u{111c1}-\\u{111c4}\\u{111d0}-\\u{111da}\\u{111dc}\\u{111e1}-\\u{111f4}\\u{11200}-\\u{11211}\\u{11213}-\\u{1122b}\\u{1123f}-\\u{11240}\\u{11280}-\\u{11286}\\u{11288}\\u{1128a}-\\u{1128d}\\u{1128f}-\\u{1129d}\\u{1129f}-\\u{112a8}\\u{112b0}-\\u{112de}\\u{112f0}-\\u{112f9}\\u{11305}-\\u{1130c}\\u{1130f}-\\u{11310}\\u{11313}-\\u{11328}\\u{1132a}-\\u{11330}\\u{11332}-\\u{11333}\\u{11335}-\\u{11339}\\u{1133d}\\u{11350}\\u{1135d}-\\u{11361}\\u{11400}-\\u{11434}\\u{11447}-\\u{1144a}\\u{11450}-\\u{11459}\\u{1145f}-\\u{11461}\\u{11480}-\\u{114af}\\u{114c4}-\\u{114c5}\\u{114c7}\\u{114d0}-\\u{114d9}\\u{11580}-\\u{115ae}\\u{115d8}-\\u{115db}\\u{11600}-\\u{1162f}\\u{11644}\\u{11650}-\\u{11659}\\u{11680}-\\u{116aa}\\u{116b8}\\u{116c0}-\\u{116c9}\\u{11700}-\\u{1171a}\\u{11730}-\\u{1173b}\\u{11740}-\\u{11746}\\u{11800}-\\u{1182b}\\u{118a0}-\\u{118f2}\\u{118ff}-\\u{11906}\\u{11909}\\u{1190c}-\\u{11913}\\u{11915}-\\u{11916}\\u{11918}-\\u{1192f}\\u{1193f}\\u{11941}\\u{11950}-\\u{11959}\\u{119a0}-\\u{119a7}\\u{119aa}-\\u{119d0}\\u{119e1}\\u{119e3}\\u{11a00}\\u{11a0b}-\\u{11a32}\\u{11a3a}\\u{11a50}\\u{11a5c}-\\u{11a89}\\u{11a9d}\\u{11ab0}-\\u{11af8}\\u{11c00}-\\u{11c08}\\u{11c0a}-\\u{11c2e}\\u{11c40}\\u{11c50}-\\u{11c6c}\\u{11c72}-\\u{11c8f}\\u{11d00}-\\u{11d06}\\u{11d08}-\\u{11d09}\\u{11d0b}-\\u{11d30}\\u{11d46}\\u{11d50}-\\u{11d59}\\u{11d60}-\\u{11d65}\\u{11d67}-\\u{11d68}\\u{11d6a}-\\u{11d89}\\u{11d98}\\u{11da0}-\\u{11da9}\\u{11ee0}-\\u{11ef2}\\u{11f02}\\u{11f04}-\\u{11f10}\\u{11f12}-\\u{11f33}\\u{11f50}-\\u{11f59}\\u{11fb0}\\u{11fc0}-\\u{11fd4}\\u{12000}-\\u{12399}\\u{12400}-\\u{1246e}\\u{12480}-\\u{12543}\\u{12f90}-\\u{12ff0}\\u{13000}-\\u{1342f}\\u{13441}-\\u{13446}\\u{14400}-\\u{14646}\\u{16800}-\\u{16a38}\\u{16a40}-\\u{16a5e}\\u{16a60}-\\u{16a69}\\u{16a70}-\\u{16abe}\\u{16ac0}-\\u{16ac9}\\u{16ad0}-\\u{16aed}\\u{16b00}-\\u{16b2f}\\u{16b40}-\\u{16b43}\\u{16b50}-\\u{16b59}\\u{16b5b}-\\u{16b61}\\u{16b63}-\\u{16b77}\\u{16b7d}-\\u{16b8f}\\u{16e40}-\\u{16e96}\\u{16f00}-\\u{16f4a}\\u{16f50}\\u{16f93}-\\u{16f9f}\\u{16fe0}-\\u{16fe1}\\u{16fe3}\\u{17000}-\\u{187f7}\\u{18800}-\\u{18cd5}\\u{18d00}-\\u{18d08}\\u{1aff0}-\\u{1aff3}\\u{1aff5}-\\u{1affb}\\u{1affd}-\\u{1affe}\\u{1b000}-\\u{1b122}\\u{1b132}\\u{1b150}-\\u{1b152}\\u{1b155}\\u{1b164}-\\u{1b167}\\u{1b170}-\\u{1b2fb}\\u{1bc00}-\\u{1bc6a}\\u{1bc70}-\\u{1bc7c}\\u{1bc80}-\\u{1bc88}\\u{1bc90}-\\u{1bc99}\\u{1d2c0}-\\u{1d2d3}\\u{1d2e0}-\\u{1d2f3}\\u{1d360}-\\u{1d378}\\u{1d400}-\\u{1d454}\\u{1d456}-\\u{1d49c}\\u{1d49e}-\\u{1d49f}\\u{1d4a2}\\u{1d4a5}-\\u{1d4a6}\\u{1d4a9}-\\u{1d4ac}\\u{1d4ae}-\\u{1d4b9}\\u{1d4bb}\\u{1d4bd}-\\u{1d4c3}\\u{1d4c5}-\\u{1d505}\\u{1d507}-\\u{1d50a}\\u{1d50d}-\\u{1d514}\\u{1d516}-\\u{1d51c}\\u{1d51e}-\\u{1d539}\\u{1d53b}-\\u{1d53e}\\u{1d540}-\\u{1d544}\\u{1d546}\\u{1d54a}-\\u{1d550}\\u{1d552}-\\u{1d6a5}\\u{1d6a8}-\\u{1d6c0}\\u{1d6c2}-\\u{1d6da}\\u{1d6dc}-\\u{1d6fa}\\u{1d6fc}-\\u{1d714}\\u{1d716}-\\u{1d734}\\u{1d736}-\\u{1d74e}\\u{1d750}-\\u{1d76e}\\u{1d770}-\\u{1d788}\\u{1d78a}-\\u{1d7a8}\\u{1d7aa}-\\u{1d7c2}\\u{1d7c4}-\\u{1d7cb}\\u{1d7ce}-\\u{1d7ff}\\u{1df00}-\\u{1df1e}\\u{1df25}-\\u{1df2a}\\u{1e030}-\\u{1e06d}\\u{1e100}-\\u{1e12c}\\u{1e137}-\\u{1e13d}\\u{1e140}-\\u{1e149}\\u{1e14e}\\u{1e290}-\\u{1e2ad}\\u{1e2c0}-\\u{1e2eb}\\u{1e2f0}-\\u{1e2f9}\\u{1e4d0}-\\u{1e4eb}\\u{1e4f0}-\\u{1e4f9}\\u{1e7e0}-\\u{1e7e6}\\u{1e7e8}-\\u{1e7eb}\\u{1e7ed}-\\u{1e7ee}\\u{1e7f0}-\\u{1e7fe}\\u{1e800}-\\u{1e8c4}\\u{1e8c7}-\\u{1e8cf}\\u{1e900}-\\u{1e943}\\u{1e94b}\\u{1e950}-\\u{1e959}\\u{1ec71}-\\u{1ecab}\\u{1ecad}-\\u{1ecaf}\\u{1ecb1}-\\u{1ecb4}\\u{1ed01}-\\u{1ed2d}\\u{1ed2f}-\\u{1ed3d}\\u{1ee00}-\\u{1ee03}\\u{1ee05}-\\u{1ee1f}\\u{1ee21}-\\u{1ee22}\\u{1ee24}\\u{1ee27}\\u{1ee29}-\\u{1ee32}\\u{1ee34}-\\u{1ee37}\\u{1ee39}\\u{1ee3b}\\u{1ee42}\\u{1ee47}\\u{1ee49}\\u{1ee4b}\\u{1ee4d}-\\u{1ee4f}\\u{1ee51}-\\u{1ee52}\\u{1ee54}\\u{1ee57}\\u{1ee59}\\u{1ee5b}\\u{1ee5d}\\u{1ee5f}\\u{1ee61}-\\u{1ee62}\\u{1ee64}\\u{1ee67}-\\u{1ee6a}\\u{1ee6c}-\\u{1ee72}\\u{1ee74}-\\u{1ee77}\\u{1ee79}-\\u{1ee7c}\\u{1ee7e}\\u{1ee80}-\\u{1ee89}\\u{1ee8b}-\\u{1ee9b}\\u{1eea1}-\\u{1eea3}\\u{1eea5}-\\u{1eea9}\\u{1eeab}-\\u{1eebb}\\u{1f100}-\\u{1f10c}\\u{1fbf0}-\\u{1fbf9}\\u{20000}-\\u{2a6df}\\u{2a700}-\\u{2b739}\\u{2b740}-\\u{2b81d}\\u{2b820}-\\u{2cea1}\\u{2ceb0}-\\u{2ebe0}\\u{2ebf0}-\\u{2ee5d}\\u{2f800}-\\u{2fa1d}\\u{30000}-\\u{3134a}\\u{31350}-\\u{323af} ,._:'–-]+(?=\\n?$)","type":"string"},"travel_end_date":{"pattern":"[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?","type":"string"},"travel_start_date":{"pattern":"[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?","type":"string"}},"required":["travel_country","travel_start_date","travel_end_date"],"type":"object"}},"$id":"https://plasmogenepi.github.io/portable-microhaplotype-object","$schema":"https://json-schema.org/draft/2019-09/schema","additionalProperties":true,"metamodel_version":"1.7.0","properties":{"bioinformatics_methods_info":{"items":{"$ref":"#/$defs/BioinformaticsMethodInfo"},"type":["array","null"]},"bioinformatics_run_info":{"items":{"$ref":"#/$defs/BioinformaticsRunInfo"},"type":["array","null"]},"detected_microhaplotypes":{"items":{"$ref":"#/$defs/DetectedMicrohaplotypes"},"type":"array"},"library_sample_info":{"items":{"$ref":"#/$defs/LibrarySampleInfo"},"type":"array"},"panel_info":{"items":{"$ref":"#/$defs/PanelInfo"},"type":"array"},"pmo_header":{"$ref":"#/$defs/PmoHeader"},"project_info":{"items":{"$ref":"#/$defs/ProjectInfo"},"type":["array","null"]},"read_counts_by_stage":{"items":{"$ref":"#/$defs/ReadCountsByStage"},"type":["array","null"]},"representative_microhaplotypes":{"$ref":"#/$defs/RepresentativeMicrohaplotypes"},"sequencing_info":{"items":{"$ref":"#/$defs/SequencingInfo"},"type":["array","null"]},"specimen_info":{"items":{"$ref":"#/$defs/SpecimenInfo"},"type":"array"},"target_info":{"items":{"$ref":"#/$defs/TargetInfo"},"type":"array"},"targeted_genomes":{"items":{"$ref":"#/$defs/GenomeInfo"},"type":["array","null"]}},"required":["library_sample_info","specimen_info","panel_info","target_info","representative_microhaplotypes","detected_microhaplotypes","pmo_header"],"type":"object","version":null};
const schema14 = {"additionalProperties":true,"properties":{"methods":{"items":{"$ref":"#/$defs/BioMethod"},"type":"array"}},"required":["methods"],"type":"object"};
const schema15 = {"additionalProperties":true,"properties":{"additional_argument":{"items":{"pattern":"^[A-z-._0-9{}\\(\\),\\/ ]+(?=\\n?$)","type":"string"},"type":["array","null"]},"program":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"program_description":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"program_url":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"program_version":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"}},"required":["program_version","program"],"type":"object"};
const pattern2 = new RegExp("^[A-z-._0-9{}\\(\\),\\/ ]+(?=\\n?$)", "u");
const pattern3 = new RegExp("^[A-z-._0-9 ]+(?=\\n?$)", "u");
const pattern4 = new RegExp("^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)", "u");

function validate38(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate38.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.program_version === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/BioMethod/required",keyword:"required",params:{missingProperty: "program_version"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.program === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/BioMethod/required",keyword:"required",params:{missingProperty: "program"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.additional_argument !== undefined){
let data0 = data.additional_argument;
if((!(Array.isArray(data0))) && (data0 !== null)){
const err2 = {instancePath:instancePath+"/additional_argument",schemaPath:"#/$defs/BioMethod/properties/additional_argument/type",keyword:"type",params:{type: schema15.properties.additional_argument.type}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(Array.isArray(data0)){
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
let data1 = data0[i0];
if(typeof data1 === "string"){
if(!pattern2.test(data1)){
const err3 = {instancePath:instancePath+"/additional_argument/" + i0,schemaPath:"#/$defs/BioMethod/properties/additional_argument/items/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9{}\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {instancePath:instancePath+"/additional_argument/" + i0,schemaPath:"#/$defs/BioMethod/properties/additional_argument/items/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
}
if(data.program !== undefined){
let data2 = data.program;
if(typeof data2 === "string"){
if(!pattern3.test(data2)){
const err5 = {instancePath:instancePath+"/program",schemaPath:"#/$defs/BioMethod/properties/program/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/program",schemaPath:"#/$defs/BioMethod/properties/program/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.program_description !== undefined){
let data3 = data.program_description;
if((typeof data3 !== "string") && (data3 !== null)){
const err7 = {instancePath:instancePath+"/program_description",schemaPath:"#/$defs/BioMethod/properties/program_description/type",keyword:"type",params:{type: schema15.properties.program_description.type}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(typeof data3 === "string"){
if(!pattern4.test(data3)){
const err8 = {instancePath:instancePath+"/program_description",schemaPath:"#/$defs/BioMethod/properties/program_description/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
if(data.program_url !== undefined){
let data4 = data.program_url;
if((typeof data4 !== "string") && (data4 !== null)){
const err9 = {instancePath:instancePath+"/program_url",schemaPath:"#/$defs/BioMethod/properties/program_url/type",keyword:"type",params:{type: schema15.properties.program_url.type}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(typeof data4 === "string"){
if(!pattern4.test(data4)){
const err10 = {instancePath:instancePath+"/program_url",schemaPath:"#/$defs/BioMethod/properties/program_url/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
if(data.program_version !== undefined){
let data5 = data.program_version;
if(typeof data5 === "string"){
if(!pattern3.test(data5)){
const err11 = {instancePath:instancePath+"/program_version",schemaPath:"#/$defs/BioMethod/properties/program_version/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/program_version",schemaPath:"#/$defs/BioMethod/properties/program_version/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
else {
const err13 = {instancePath,schemaPath:"#/$defs/BioMethod/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
validate38.errors = vErrors;
return errors === 0;
}
validate38.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate37(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate37.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.methods === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/BioinformaticsMethodInfo/required",keyword:"required",params:{missingProperty: "methods"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.methods !== undefined){
let data0 = data.methods;
if(Array.isArray(data0)){
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
if(!(validate38(data0[i0], {instancePath:instancePath+"/methods/" + i0,parentData:data0,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate38.errors : vErrors.concat(validate38.errors);
errors = vErrors.length;
}
}
}
else {
const err1 = {instancePath:instancePath+"/methods",schemaPath:"#/$defs/BioinformaticsMethodInfo/properties/methods/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
else {
const err2 = {instancePath,schemaPath:"#/$defs/BioinformaticsMethodInfo/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
validate37.errors = vErrors;
return errors === 0;
}
validate37.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema16 = {"additionalProperties":true,"properties":{"bioinformatics_methods_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"bioinformatics_run_name":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"run_date":{"pattern":"[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?","type":["string","null"]}},"required":["bioinformatics_methods_id","bioinformatics_run_name"],"type":"object"};
const pattern7 = new RegExp("^[0-9]+(?=\\n?$)", "u");
const pattern9 = new RegExp("[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?", "u");

function validate41(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate41.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.bioinformatics_methods_id === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/BioinformaticsRunInfo/required",keyword:"required",params:{missingProperty: "bioinformatics_methods_id"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.bioinformatics_run_name === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/BioinformaticsRunInfo/required",keyword:"required",params:{missingProperty: "bioinformatics_run_name"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.bioinformatics_methods_id !== undefined){
let data0 = data.bioinformatics_methods_id;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
const err2 = {instancePath:instancePath+"/bioinformatics_methods_id",schemaPath:"#/$defs/BioinformaticsRunInfo/properties/bioinformatics_methods_id/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 < 0 || isNaN(data0)){
const err3 = {instancePath:instancePath+"/bioinformatics_methods_id",schemaPath:"#/$defs/BioinformaticsRunInfo/properties/bioinformatics_methods_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(typeof data0 === "string"){
if(!pattern7.test(data0)){
const err4 = {instancePath:instancePath+"/bioinformatics_methods_id",schemaPath:"#/$defs/BioinformaticsRunInfo/properties/bioinformatics_methods_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
if(data.bioinformatics_run_name !== undefined){
let data1 = data.bioinformatics_run_name;
if(typeof data1 === "string"){
if(!pattern3.test(data1)){
const err5 = {instancePath:instancePath+"/bioinformatics_run_name",schemaPath:"#/$defs/BioinformaticsRunInfo/properties/bioinformatics_run_name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/bioinformatics_run_name",schemaPath:"#/$defs/BioinformaticsRunInfo/properties/bioinformatics_run_name/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.run_date !== undefined){
let data2 = data.run_date;
if((typeof data2 !== "string") && (data2 !== null)){
const err7 = {instancePath:instancePath+"/run_date",schemaPath:"#/$defs/BioinformaticsRunInfo/properties/run_date/type",keyword:"type",params:{type: schema16.properties.run_date.type}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(typeof data2 === "string"){
if(!pattern9.test(data2)){
const err8 = {instancePath:instancePath+"/run_date",schemaPath:"#/$defs/BioinformaticsRunInfo/properties/run_date/pattern",keyword:"pattern",params:{pattern: "[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?"}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
}
else {
const err9 = {instancePath,schemaPath:"#/$defs/BioinformaticsRunInfo/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
validate41.errors = vErrors;
return errors === 0;
}
validate41.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema17 = {"additionalProperties":true,"properties":{"bioinformatics_run_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":["integer","null"]},"library_samples":{"items":{"$ref":"#/$defs/DetectedMicrohaplotypesForSample"},"type":"array"}},"required":["library_samples"],"type":"object"};
const schema18 = {"additionalProperties":true,"properties":{"library_sample_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"target_results":{"items":{"$ref":"#/$defs/DetectedMicrohaplotypesForTarget"},"type":"array"}},"required":["library_sample_id","target_results"],"type":"object"};
const schema19 = {"additionalProperties":true,"properties":{"mhaps":{"items":{"$ref":"#/$defs/MicrohaplotypeForTarget"},"type":"array"},"mhaps_target_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"}},"required":["mhaps_target_id","mhaps"],"type":"object"};
const schema20 = {"additionalProperties":true,"properties":{"mhap_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"reads":{"minimum":0,"type":"integer"},"umis":{"minimum":0,"type":["integer","null"]}},"required":["mhap_id","reads"],"type":"object"};

function validate46(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate46.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.mhap_id === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/MicrohaplotypeForTarget/required",keyword:"required",params:{missingProperty: "mhap_id"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.reads === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/MicrohaplotypeForTarget/required",keyword:"required",params:{missingProperty: "reads"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.mhap_id !== undefined){
let data0 = data.mhap_id;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
const err2 = {instancePath:instancePath+"/mhap_id",schemaPath:"#/$defs/MicrohaplotypeForTarget/properties/mhap_id/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 < 0 || isNaN(data0)){
const err3 = {instancePath:instancePath+"/mhap_id",schemaPath:"#/$defs/MicrohaplotypeForTarget/properties/mhap_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(typeof data0 === "string"){
if(!pattern7.test(data0)){
const err4 = {instancePath:instancePath+"/mhap_id",schemaPath:"#/$defs/MicrohaplotypeForTarget/properties/mhap_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
if(data.reads !== undefined){
let data1 = data.reads;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
const err5 = {instancePath:instancePath+"/reads",schemaPath:"#/$defs/MicrohaplotypeForTarget/properties/reads/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 < 0 || isNaN(data1)){
const err6 = {instancePath:instancePath+"/reads",schemaPath:"#/$defs/MicrohaplotypeForTarget/properties/reads/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
}
if(data.umis !== undefined){
let data2 = data.umis;
if((!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))) && (data2 !== null)){
const err7 = {instancePath:instancePath+"/umis",schemaPath:"#/$defs/MicrohaplotypeForTarget/properties/umis/type",keyword:"type",params:{type: schema20.properties.umis.type}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 < 0 || isNaN(data2)){
const err8 = {instancePath:instancePath+"/umis",schemaPath:"#/$defs/MicrohaplotypeForTarget/properties/umis/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
}
else {
const err9 = {instancePath,schemaPath:"#/$defs/MicrohaplotypeForTarget/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
validate46.errors = vErrors;
return errors === 0;
}
validate46.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate45(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate45.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.mhaps_target_id === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/DetectedMicrohaplotypesForTarget/required",keyword:"required",params:{missingProperty: "mhaps_target_id"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.mhaps === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/DetectedMicrohaplotypesForTarget/required",keyword:"required",params:{missingProperty: "mhaps"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.mhaps !== undefined){
let data0 = data.mhaps;
if(Array.isArray(data0)){
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
if(!(validate46(data0[i0], {instancePath:instancePath+"/mhaps/" + i0,parentData:data0,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate46.errors : vErrors.concat(validate46.errors);
errors = vErrors.length;
}
}
}
else {
const err2 = {instancePath:instancePath+"/mhaps",schemaPath:"#/$defs/DetectedMicrohaplotypesForTarget/properties/mhaps/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.mhaps_target_id !== undefined){
let data2 = data.mhaps_target_id;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
const err3 = {instancePath:instancePath+"/mhaps_target_id",schemaPath:"#/$defs/DetectedMicrohaplotypesForTarget/properties/mhaps_target_id/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 < 0 || isNaN(data2)){
const err4 = {instancePath:instancePath+"/mhaps_target_id",schemaPath:"#/$defs/DetectedMicrohaplotypesForTarget/properties/mhaps_target_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(typeof data2 === "string"){
if(!pattern7.test(data2)){
const err5 = {instancePath:instancePath+"/mhaps_target_id",schemaPath:"#/$defs/DetectedMicrohaplotypesForTarget/properties/mhaps_target_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
}
else {
const err6 = {instancePath,schemaPath:"#/$defs/DetectedMicrohaplotypesForTarget/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
validate45.errors = vErrors;
return errors === 0;
}
validate45.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate44(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate44.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.library_sample_id === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/DetectedMicrohaplotypesForSample/required",keyword:"required",params:{missingProperty: "library_sample_id"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.target_results === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/DetectedMicrohaplotypesForSample/required",keyword:"required",params:{missingProperty: "target_results"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.library_sample_id !== undefined){
let data0 = data.library_sample_id;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
const err2 = {instancePath:instancePath+"/library_sample_id",schemaPath:"#/$defs/DetectedMicrohaplotypesForSample/properties/library_sample_id/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 < 0 || isNaN(data0)){
const err3 = {instancePath:instancePath+"/library_sample_id",schemaPath:"#/$defs/DetectedMicrohaplotypesForSample/properties/library_sample_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(typeof data0 === "string"){
if(!pattern7.test(data0)){
const err4 = {instancePath:instancePath+"/library_sample_id",schemaPath:"#/$defs/DetectedMicrohaplotypesForSample/properties/library_sample_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
if(data.target_results !== undefined){
let data1 = data.target_results;
if(Array.isArray(data1)){
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
if(!(validate45(data1[i0], {instancePath:instancePath+"/target_results/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate45.errors : vErrors.concat(validate45.errors);
errors = vErrors.length;
}
}
}
else {
const err5 = {instancePath:instancePath+"/target_results",schemaPath:"#/$defs/DetectedMicrohaplotypesForSample/properties/target_results/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
else {
const err6 = {instancePath,schemaPath:"#/$defs/DetectedMicrohaplotypesForSample/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
validate44.errors = vErrors;
return errors === 0;
}
validate44.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate43(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate43.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.library_samples === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/DetectedMicrohaplotypes/required",keyword:"required",params:{missingProperty: "library_samples"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.bioinformatics_run_id !== undefined){
let data0 = data.bioinformatics_run_id;
if((!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))) && (data0 !== null)){
const err1 = {instancePath:instancePath+"/bioinformatics_run_id",schemaPath:"#/$defs/DetectedMicrohaplotypes/properties/bioinformatics_run_id/type",keyword:"type",params:{type: schema17.properties.bioinformatics_run_id.type}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 < 0 || isNaN(data0)){
const err2 = {instancePath:instancePath+"/bioinformatics_run_id",schemaPath:"#/$defs/DetectedMicrohaplotypes/properties/bioinformatics_run_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(typeof data0 === "string"){
if(!pattern7.test(data0)){
const err3 = {instancePath:instancePath+"/bioinformatics_run_id",schemaPath:"#/$defs/DetectedMicrohaplotypes/properties/bioinformatics_run_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
if(data.library_samples !== undefined){
let data1 = data.library_samples;
if(Array.isArray(data1)){
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
if(!(validate44(data1[i0], {instancePath:instancePath+"/library_samples/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate44.errors : vErrors.concat(validate44.errors);
errors = vErrors.length;
}
}
}
else {
const err4 = {instancePath:instancePath+"/library_samples",schemaPath:"#/$defs/DetectedMicrohaplotypes/properties/library_samples/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
else {
const err5 = {instancePath,schemaPath:"#/$defs/DetectedMicrohaplotypes/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
validate43.errors = vErrors;
return errors === 0;
}
validate43.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema21 = {"additionalProperties":true,"properties":{"alternate_identifiers":{"items":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"type":["array","null"]},"experiment_accession":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":["string","null"]},"fastqs_loc":{"pattern":"^[A-z-.;,_0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"library_prep_plate_info":{"anyOf":[{"$ref":"#/$defs/PlateInfo"},{"type":"null"}]},"library_sample_name":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"panel_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"qpcr_parasite_density_info":{"items":{"$ref":"#/$defs/ParasiteDensity"},"type":["array","null"]},"run_accession":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":["string","null"]},"sequencing_info_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":["integer","null"]},"specimen_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"}},"required":["specimen_id","panel_id","library_sample_name"],"type":"object"};
const pattern15 = new RegExp("^[A-z-._0-9]+(?=\\n?$)", "u");
const pattern16 = new RegExp("^[A-z-.;,_0-9\\(\\),\\/ ]+(?=\\n?$)", "u");
const schema22 = {"additionalProperties":true,"properties":{"plate_col":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"plate_name":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"plate_row":{"pattern":"^[A-z](?=\\n?$)","type":"string"}},"required":["plate_name","plate_row","plate_col"],"type":"object"};
const pattern19 = new RegExp("^[A-z](?=\\n?$)", "u");

function validate52(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate52.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.plate_name === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/PlateInfo/required",keyword:"required",params:{missingProperty: "plate_name"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.plate_row === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/PlateInfo/required",keyword:"required",params:{missingProperty: "plate_row"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.plate_col === undefined){
const err2 = {instancePath,schemaPath:"#/$defs/PlateInfo/required",keyword:"required",params:{missingProperty: "plate_col"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.plate_col !== undefined){
let data0 = data.plate_col;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
const err3 = {instancePath:instancePath+"/plate_col",schemaPath:"#/$defs/PlateInfo/properties/plate_col/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 < 0 || isNaN(data0)){
const err4 = {instancePath:instancePath+"/plate_col",schemaPath:"#/$defs/PlateInfo/properties/plate_col/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(typeof data0 === "string"){
if(!pattern7.test(data0)){
const err5 = {instancePath:instancePath+"/plate_col",schemaPath:"#/$defs/PlateInfo/properties/plate_col/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
if(data.plate_name !== undefined){
let data1 = data.plate_name;
if(typeof data1 === "string"){
if(!pattern3.test(data1)){
const err6 = {instancePath:instancePath+"/plate_name",schemaPath:"#/$defs/PlateInfo/properties/plate_name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {instancePath:instancePath+"/plate_name",schemaPath:"#/$defs/PlateInfo/properties/plate_name/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.plate_row !== undefined){
let data2 = data.plate_row;
if(typeof data2 === "string"){
if(!pattern19.test(data2)){
const err8 = {instancePath:instancePath+"/plate_row",schemaPath:"#/$defs/PlateInfo/properties/plate_row/pattern",keyword:"pattern",params:{pattern: "^[A-z](?=\\n?$)"}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
else {
const err9 = {instancePath:instancePath+"/plate_row",schemaPath:"#/$defs/PlateInfo/properties/plate_row/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
else {
const err10 = {instancePath,schemaPath:"#/$defs/PlateInfo/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
validate52.errors = vErrors;
return errors === 0;
}
validate52.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema23 = {"additionalProperties":true,"properties":{"date_measured":{"pattern":"(?:[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?)?|NA)","type":["string","null"]},"density_method_comments":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"parasite_density":{"minimum":0,"pattern":"^[-+]?\\\\d*\\\\[^\\n]?\\\\d+(?:[eE][-+]?\\\\d+)?(?=\\n?$)","type":"number"},"parasite_density_method":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"}},"required":["parasite_density_method","parasite_density"],"type":"object"};
const pattern22 = new RegExp("(?:[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?)?|NA)", "u");
const pattern24 = new RegExp("^[-+]?\\\\d*\\\\[^\\n]?\\\\d+(?:[eE][-+]?\\\\d+)?(?=\\n?$)", "u");

function validate54(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate54.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.parasite_density_method === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/ParasiteDensity/required",keyword:"required",params:{missingProperty: "parasite_density_method"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.parasite_density === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/ParasiteDensity/required",keyword:"required",params:{missingProperty: "parasite_density"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.date_measured !== undefined){
let data0 = data.date_measured;
if((typeof data0 !== "string") && (data0 !== null)){
const err2 = {instancePath:instancePath+"/date_measured",schemaPath:"#/$defs/ParasiteDensity/properties/date_measured/type",keyword:"type",params:{type: schema23.properties.date_measured.type}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(typeof data0 === "string"){
if(!pattern22.test(data0)){
const err3 = {instancePath:instancePath+"/date_measured",schemaPath:"#/$defs/ParasiteDensity/properties/date_measured/pattern",keyword:"pattern",params:{pattern: "(?:[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?)?|NA)"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
if(data.density_method_comments !== undefined){
let data1 = data.density_method_comments;
if((typeof data1 !== "string") && (data1 !== null)){
const err4 = {instancePath:instancePath+"/density_method_comments",schemaPath:"#/$defs/ParasiteDensity/properties/density_method_comments/type",keyword:"type",params:{type: schema23.properties.density_method_comments.type}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(typeof data1 === "string"){
if(!pattern4.test(data1)){
const err5 = {instancePath:instancePath+"/density_method_comments",schemaPath:"#/$defs/ParasiteDensity/properties/density_method_comments/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
if(data.parasite_density !== undefined){
let data2 = data.parasite_density;
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 < 0 || isNaN(data2)){
const err6 = {instancePath:instancePath+"/parasite_density",schemaPath:"#/$defs/ParasiteDensity/properties/parasite_density/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {instancePath:instancePath+"/parasite_density",schemaPath:"#/$defs/ParasiteDensity/properties/parasite_density/type",keyword:"type",params:{type: "number"}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(typeof data2 === "string"){
if(!pattern24.test(data2)){
const err8 = {instancePath:instancePath+"/parasite_density",schemaPath:"#/$defs/ParasiteDensity/properties/parasite_density/pattern",keyword:"pattern",params:{pattern: "^[-+]?\\\\d*\\\\[^\\n]?\\\\d+(?:[eE][-+]?\\\\d+)?(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
if(data.parasite_density_method !== undefined){
let data3 = data.parasite_density_method;
if(typeof data3 === "string"){
if(!pattern3.test(data3)){
const err9 = {instancePath:instancePath+"/parasite_density_method",schemaPath:"#/$defs/ParasiteDensity/properties/parasite_density_method/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/parasite_density_method",schemaPath:"#/$defs/ParasiteDensity/properties/parasite_density_method/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
else {
const err11 = {instancePath,schemaPath:"#/$defs/ParasiteDensity/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
validate54.errors = vErrors;
return errors === 0;
}
validate54.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate51(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate51.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.specimen_id === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/LibrarySampleInfo/required",keyword:"required",params:{missingProperty: "specimen_id"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.panel_id === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/LibrarySampleInfo/required",keyword:"required",params:{missingProperty: "panel_id"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.library_sample_name === undefined){
const err2 = {instancePath,schemaPath:"#/$defs/LibrarySampleInfo/required",keyword:"required",params:{missingProperty: "library_sample_name"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.alternate_identifiers !== undefined){
let data0 = data.alternate_identifiers;
if((!(Array.isArray(data0))) && (data0 !== null)){
const err3 = {instancePath:instancePath+"/alternate_identifiers",schemaPath:"#/$defs/LibrarySampleInfo/properties/alternate_identifiers/type",keyword:"type",params:{type: schema21.properties.alternate_identifiers.type}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(Array.isArray(data0)){
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
let data1 = data0[i0];
if(typeof data1 === "string"){
if(!pattern3.test(data1)){
const err4 = {instancePath:instancePath+"/alternate_identifiers/" + i0,schemaPath:"#/$defs/LibrarySampleInfo/properties/alternate_identifiers/items/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/alternate_identifiers/" + i0,schemaPath:"#/$defs/LibrarySampleInfo/properties/alternate_identifiers/items/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
}
if(data.experiment_accession !== undefined){
let data2 = data.experiment_accession;
if((typeof data2 !== "string") && (data2 !== null)){
const err6 = {instancePath:instancePath+"/experiment_accession",schemaPath:"#/$defs/LibrarySampleInfo/properties/experiment_accession/type",keyword:"type",params:{type: schema21.properties.experiment_accession.type}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(typeof data2 === "string"){
if(!pattern15.test(data2)){
const err7 = {instancePath:instancePath+"/experiment_accession",schemaPath:"#/$defs/LibrarySampleInfo/properties/experiment_accession/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
}
if(data.fastqs_loc !== undefined){
let data3 = data.fastqs_loc;
if((typeof data3 !== "string") && (data3 !== null)){
const err8 = {instancePath:instancePath+"/fastqs_loc",schemaPath:"#/$defs/LibrarySampleInfo/properties/fastqs_loc/type",keyword:"type",params:{type: schema21.properties.fastqs_loc.type}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(typeof data3 === "string"){
if(!pattern16.test(data3)){
const err9 = {instancePath:instancePath+"/fastqs_loc",schemaPath:"#/$defs/LibrarySampleInfo/properties/fastqs_loc/pattern",keyword:"pattern",params:{pattern: "^[A-z-.;,_0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
if(data.library_prep_plate_info !== undefined){
let data4 = data.library_prep_plate_info;
const _errs11 = errors;
let valid3 = false;
const _errs12 = errors;
if(!(validate52(data4, {instancePath:instancePath+"/library_prep_plate_info",parentData:data,parentDataProperty:"library_prep_plate_info",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate52.errors : vErrors.concat(validate52.errors);
errors = vErrors.length;
}
var _valid0 = _errs12 === errors;
valid3 = valid3 || _valid0;
const _errs13 = errors;
if(data4 !== null){
const err10 = {instancePath:instancePath+"/library_prep_plate_info",schemaPath:"#/$defs/LibrarySampleInfo/properties/library_prep_plate_info/anyOf/1/type",keyword:"type",params:{type: "null"}};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
var _valid0 = _errs13 === errors;
valid3 = valid3 || _valid0;
if(!valid3){
const err11 = {instancePath:instancePath+"/library_prep_plate_info",schemaPath:"#/$defs/LibrarySampleInfo/properties/library_prep_plate_info/anyOf",keyword:"anyOf",params:{}};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
else {
errors = _errs11;
if(vErrors !== null){
if(_errs11){
vErrors.length = _errs11;
}
else {
vErrors = null;
}
}
}
}
if(data.library_sample_name !== undefined){
let data5 = data.library_sample_name;
if(typeof data5 === "string"){
if(!pattern3.test(data5)){
const err12 = {instancePath:instancePath+"/library_sample_name",schemaPath:"#/$defs/LibrarySampleInfo/properties/library_sample_name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
else {
const err13 = {instancePath:instancePath+"/library_sample_name",schemaPath:"#/$defs/LibrarySampleInfo/properties/library_sample_name/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.panel_id !== undefined){
let data6 = data.panel_id;
if(!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))){
const err14 = {instancePath:instancePath+"/panel_id",schemaPath:"#/$defs/LibrarySampleInfo/properties/panel_id/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 < 0 || isNaN(data6)){
const err15 = {instancePath:instancePath+"/panel_id",schemaPath:"#/$defs/LibrarySampleInfo/properties/panel_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(typeof data6 === "string"){
if(!pattern7.test(data6)){
const err16 = {instancePath:instancePath+"/panel_id",schemaPath:"#/$defs/LibrarySampleInfo/properties/panel_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
}
if(data.qpcr_parasite_density_info !== undefined){
let data7 = data.qpcr_parasite_density_info;
if((!(Array.isArray(data7))) && (data7 !== null)){
const err17 = {instancePath:instancePath+"/qpcr_parasite_density_info",schemaPath:"#/$defs/LibrarySampleInfo/properties/qpcr_parasite_density_info/type",keyword:"type",params:{type: schema21.properties.qpcr_parasite_density_info.type}};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(Array.isArray(data7)){
const len1 = data7.length;
for(let i1=0; i1<len1; i1++){
if(!(validate54(data7[i1], {instancePath:instancePath+"/qpcr_parasite_density_info/" + i1,parentData:data7,parentDataProperty:i1,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate54.errors : vErrors.concat(validate54.errors);
errors = vErrors.length;
}
}
}
}
if(data.run_accession !== undefined){
let data9 = data.run_accession;
if((typeof data9 !== "string") && (data9 !== null)){
const err18 = {instancePath:instancePath+"/run_accession",schemaPath:"#/$defs/LibrarySampleInfo/properties/run_accession/type",keyword:"type",params:{type: schema21.properties.run_accession.type}};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(typeof data9 === "string"){
if(!pattern15.test(data9)){
const err19 = {instancePath:instancePath+"/run_accession",schemaPath:"#/$defs/LibrarySampleInfo/properties/run_accession/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
}
if(data.sequencing_info_id !== undefined){
let data10 = data.sequencing_info_id;
if((!(((typeof data10 == "number") && (!(data10 % 1) && !isNaN(data10))) && (isFinite(data10)))) && (data10 !== null)){
const err20 = {instancePath:instancePath+"/sequencing_info_id",schemaPath:"#/$defs/LibrarySampleInfo/properties/sequencing_info_id/type",keyword:"type",params:{type: schema21.properties.sequencing_info_id.type}};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
if((typeof data10 == "number") && (isFinite(data10))){
if(data10 < 0 || isNaN(data10)){
const err21 = {instancePath:instancePath+"/sequencing_info_id",schemaPath:"#/$defs/LibrarySampleInfo/properties/sequencing_info_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(typeof data10 === "string"){
if(!pattern7.test(data10)){
const err22 = {instancePath:instancePath+"/sequencing_info_id",schemaPath:"#/$defs/LibrarySampleInfo/properties/sequencing_info_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
}
if(data.specimen_id !== undefined){
let data11 = data.specimen_id;
if(!(((typeof data11 == "number") && (!(data11 % 1) && !isNaN(data11))) && (isFinite(data11)))){
const err23 = {instancePath:instancePath+"/specimen_id",schemaPath:"#/$defs/LibrarySampleInfo/properties/specimen_id/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if((typeof data11 == "number") && (isFinite(data11))){
if(data11 < 0 || isNaN(data11)){
const err24 = {instancePath:instancePath+"/specimen_id",schemaPath:"#/$defs/LibrarySampleInfo/properties/specimen_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
if(typeof data11 === "string"){
if(!pattern7.test(data11)){
const err25 = {instancePath:instancePath+"/specimen_id",schemaPath:"#/$defs/LibrarySampleInfo/properties/specimen_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
}
}
else {
const err26 = {instancePath,schemaPath:"#/$defs/LibrarySampleInfo/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
validate51.errors = vErrors;
return errors === 0;
}
validate51.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema24 = {"additionalProperties":true,"properties":{"panel_name":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"},"reactions":{"items":{"$ref":"#/$defs/ReactionInfo"},"type":"array"}},"required":["reactions","panel_name"],"type":"object"};
const schema25 = {"additionalProperties":true,"properties":{"panel_targets":{"items":{"minimum":0,"type":"integer"},"type":"array"},"reaction_name":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"}},"required":["panel_targets","reaction_name"],"type":"object"};

function validate58(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate58.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.panel_targets === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/ReactionInfo/required",keyword:"required",params:{missingProperty: "panel_targets"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.reaction_name === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/ReactionInfo/required",keyword:"required",params:{missingProperty: "reaction_name"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.panel_targets !== undefined){
let data0 = data.panel_targets;
if(Array.isArray(data0)){
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
let data1 = data0[i0];
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
const err2 = {instancePath:instancePath+"/panel_targets/" + i0,schemaPath:"#/$defs/ReactionInfo/properties/panel_targets/items/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 < 0 || isNaN(data1)){
const err3 = {instancePath:instancePath+"/panel_targets/" + i0,schemaPath:"#/$defs/ReactionInfo/properties/panel_targets/items/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
}
else {
const err4 = {instancePath:instancePath+"/panel_targets",schemaPath:"#/$defs/ReactionInfo/properties/panel_targets/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data.reaction_name !== undefined){
let data2 = data.reaction_name;
if(typeof data2 === "string"){
if(!pattern15.test(data2)){
const err5 = {instancePath:instancePath+"/reaction_name",schemaPath:"#/$defs/ReactionInfo/properties/reaction_name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/reaction_name",schemaPath:"#/$defs/ReactionInfo/properties/reaction_name/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
}
else {
const err7 = {instancePath,schemaPath:"#/$defs/ReactionInfo/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
validate58.errors = vErrors;
return errors === 0;
}
validate58.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate57(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate57.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.reactions === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/PanelInfo/required",keyword:"required",params:{missingProperty: "reactions"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.panel_name === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/PanelInfo/required",keyword:"required",params:{missingProperty: "panel_name"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.panel_name !== undefined){
let data0 = data.panel_name;
if(typeof data0 === "string"){
if(!pattern15.test(data0)){
const err2 = {instancePath:instancePath+"/panel_name",schemaPath:"#/$defs/PanelInfo/properties/panel_name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/panel_name",schemaPath:"#/$defs/PanelInfo/properties/panel_name/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(data.reactions !== undefined){
let data1 = data.reactions;
if(Array.isArray(data1)){
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
if(!(validate58(data1[i0], {instancePath:instancePath+"/reactions/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate58.errors : vErrors.concat(validate58.errors);
errors = vErrors.length;
}
}
}
else {
const err4 = {instancePath:instancePath+"/reactions",schemaPath:"#/$defs/PanelInfo/properties/reactions/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
else {
const err5 = {instancePath,schemaPath:"#/$defs/PanelInfo/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
validate57.errors = vErrors;
return errors === 0;
}
validate57.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema26 = {"additionalProperties":true,"properties":{"creation_date":{"pattern":"[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?","type":["string","null"]},"generation_method":{"anyOf":[{"$ref":"#/$defs/PmoGenerationMethod"},{"type":"null"}]},"pmo_version":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"}},"required":["pmo_version"],"type":"object"};
const schema27 = {"additionalProperties":true,"properties":{"program_name":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"program_version":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"}},"required":["program_version","program_name"],"type":"object"};

function validate62(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate62.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.program_version === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/PmoGenerationMethod/required",keyword:"required",params:{missingProperty: "program_version"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.program_name === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/PmoGenerationMethod/required",keyword:"required",params:{missingProperty: "program_name"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.program_name !== undefined){
let data0 = data.program_name;
if(typeof data0 === "string"){
if(!pattern3.test(data0)){
const err2 = {instancePath:instancePath+"/program_name",schemaPath:"#/$defs/PmoGenerationMethod/properties/program_name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/program_name",schemaPath:"#/$defs/PmoGenerationMethod/properties/program_name/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(data.program_version !== undefined){
let data1 = data.program_version;
if(typeof data1 === "string"){
if(!pattern3.test(data1)){
const err4 = {instancePath:instancePath+"/program_version",schemaPath:"#/$defs/PmoGenerationMethod/properties/program_version/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/program_version",schemaPath:"#/$defs/PmoGenerationMethod/properties/program_version/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
else {
const err6 = {instancePath,schemaPath:"#/$defs/PmoGenerationMethod/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
validate62.errors = vErrors;
return errors === 0;
}
validate62.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate61(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate61.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.pmo_version === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/PmoHeader/required",keyword:"required",params:{missingProperty: "pmo_version"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.creation_date !== undefined){
let data0 = data.creation_date;
if((typeof data0 !== "string") && (data0 !== null)){
const err1 = {instancePath:instancePath+"/creation_date",schemaPath:"#/$defs/PmoHeader/properties/creation_date/type",keyword:"type",params:{type: schema26.properties.creation_date.type}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(typeof data0 === "string"){
if(!pattern9.test(data0)){
const err2 = {instancePath:instancePath+"/creation_date",schemaPath:"#/$defs/PmoHeader/properties/creation_date/pattern",keyword:"pattern",params:{pattern: "[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
if(data.generation_method !== undefined){
let data1 = data.generation_method;
const _errs5 = errors;
let valid1 = false;
const _errs6 = errors;
if(!(validate62(data1, {instancePath:instancePath+"/generation_method",parentData:data,parentDataProperty:"generation_method",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate62.errors : vErrors.concat(validate62.errors);
errors = vErrors.length;
}
var _valid0 = _errs6 === errors;
valid1 = valid1 || _valid0;
const _errs7 = errors;
if(data1 !== null){
const err3 = {instancePath:instancePath+"/generation_method",schemaPath:"#/$defs/PmoHeader/properties/generation_method/anyOf/1/type",keyword:"type",params:{type: "null"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var _valid0 = _errs7 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err4 = {instancePath:instancePath+"/generation_method",schemaPath:"#/$defs/PmoHeader/properties/generation_method/anyOf",keyword:"anyOf",params:{}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
else {
errors = _errs5;
if(vErrors !== null){
if(_errs5){
vErrors.length = _errs5;
}
else {
vErrors = null;
}
}
}
}
if(data.pmo_version !== undefined){
let data2 = data.pmo_version;
if(typeof data2 === "string"){
if(!pattern3.test(data2)){
const err5 = {instancePath:instancePath+"/pmo_version",schemaPath:"#/$defs/PmoHeader/properties/pmo_version/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/pmo_version",schemaPath:"#/$defs/PmoHeader/properties/pmo_version/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
}
else {
const err7 = {instancePath,schemaPath:"#/$defs/PmoHeader/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
validate61.errors = vErrors;
return errors === 0;
}
validate61.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema28 = {"additionalProperties":true,"properties":{"BioProject_accession":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":["string","null"]},"project_collector_chief_scientist":{"pattern":"^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"project_contributors":{"items":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"type":["array","null"]},"project_description":{"type":"string"},"project_name":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"project_type":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":["string","null"]}},"required":["project_name","project_description"],"type":"object"};
const pattern36 = new RegExp("^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)", "u");

function validate65(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate65.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.project_name === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/ProjectInfo/required",keyword:"required",params:{missingProperty: "project_name"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.project_description === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/ProjectInfo/required",keyword:"required",params:{missingProperty: "project_description"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.BioProject_accession !== undefined){
let data0 = data.BioProject_accession;
if((typeof data0 !== "string") && (data0 !== null)){
const err2 = {instancePath:instancePath+"/BioProject_accession",schemaPath:"#/$defs/ProjectInfo/properties/BioProject_accession/type",keyword:"type",params:{type: schema28.properties.BioProject_accession.type}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(typeof data0 === "string"){
if(!pattern3.test(data0)){
const err3 = {instancePath:instancePath+"/BioProject_accession",schemaPath:"#/$defs/ProjectInfo/properties/BioProject_accession/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
if(data.project_collector_chief_scientist !== undefined){
let data1 = data.project_collector_chief_scientist;
if((typeof data1 !== "string") && (data1 !== null)){
const err4 = {instancePath:instancePath+"/project_collector_chief_scientist",schemaPath:"#/$defs/ProjectInfo/properties/project_collector_chief_scientist/type",keyword:"type",params:{type: schema28.properties.project_collector_chief_scientist.type}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(typeof data1 === "string"){
if(!pattern36.test(data1)){
const err5 = {instancePath:instancePath+"/project_collector_chief_scientist",schemaPath:"#/$defs/ProjectInfo/properties/project_collector_chief_scientist/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
if(data.project_contributors !== undefined){
let data2 = data.project_contributors;
if((!(Array.isArray(data2))) && (data2 !== null)){
const err6 = {instancePath:instancePath+"/project_contributors",schemaPath:"#/$defs/ProjectInfo/properties/project_contributors/type",keyword:"type",params:{type: schema28.properties.project_contributors.type}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(Array.isArray(data2)){
const len0 = data2.length;
for(let i0=0; i0<len0; i0++){
let data3 = data2[i0];
if(typeof data3 === "string"){
if(!pattern3.test(data3)){
const err7 = {instancePath:instancePath+"/project_contributors/" + i0,schemaPath:"#/$defs/ProjectInfo/properties/project_contributors/items/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
else {
const err8 = {instancePath:instancePath+"/project_contributors/" + i0,schemaPath:"#/$defs/ProjectInfo/properties/project_contributors/items/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
}
if(data.project_description !== undefined){
if(typeof data.project_description !== "string"){
const err9 = {instancePath:instancePath+"/project_description",schemaPath:"#/$defs/ProjectInfo/properties/project_description/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.project_name !== undefined){
let data5 = data.project_name;
if(typeof data5 === "string"){
if(!pattern3.test(data5)){
const err10 = {instancePath:instancePath+"/project_name",schemaPath:"#/$defs/ProjectInfo/properties/project_name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/project_name",schemaPath:"#/$defs/ProjectInfo/properties/project_name/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.project_type !== undefined){
let data6 = data.project_type;
if((typeof data6 !== "string") && (data6 !== null)){
const err12 = {instancePath:instancePath+"/project_type",schemaPath:"#/$defs/ProjectInfo/properties/project_type/type",keyword:"type",params:{type: schema28.properties.project_type.type}};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(typeof data6 === "string"){
if(!pattern3.test(data6)){
const err13 = {instancePath:instancePath+"/project_type",schemaPath:"#/$defs/ProjectInfo/properties/project_type/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
}
else {
const err14 = {instancePath,schemaPath:"#/$defs/ProjectInfo/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
validate65.errors = vErrors;
return errors === 0;
}
validate65.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema29 = {"additionalProperties":true,"properties":{"bioinformatics_run_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":["integer","null"]},"read_counts_by_library_sample_by_stage":{"items":{"$ref":"#/$defs/ReadCountsByStageForLibrarySample"},"type":"array"}},"required":["read_counts_by_library_sample_by_stage"],"type":"object"};
const schema30 = {"additionalProperties":true,"properties":{"library_sample_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"read_counts_for_targets":{"items":{"$ref":"#/$defs/ReadCountsByStageForTarget"},"type":["array","null"]},"total_raw_count":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"}},"required":["library_sample_id","total_raw_count"],"type":"object"};
const schema31 = {"additionalProperties":true,"properties":{"stages":{"items":{"$ref":"#/$defs/StageReadCounts"},"type":"array"},"target_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"}},"required":["target_id","stages"],"type":"object"};
const schema32 = {"additionalProperties":true,"properties":{"reads":{"minimum":0,"type":"integer"},"stage":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"}},"required":["reads","stage"],"type":"object"};

function validate70(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate70.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.reads === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/StageReadCounts/required",keyword:"required",params:{missingProperty: "reads"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.stage === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/StageReadCounts/required",keyword:"required",params:{missingProperty: "stage"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.reads !== undefined){
let data0 = data.reads;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
const err2 = {instancePath:instancePath+"/reads",schemaPath:"#/$defs/StageReadCounts/properties/reads/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 < 0 || isNaN(data0)){
const err3 = {instancePath:instancePath+"/reads",schemaPath:"#/$defs/StageReadCounts/properties/reads/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
if(data.stage !== undefined){
let data1 = data.stage;
if(typeof data1 === "string"){
if(!pattern3.test(data1)){
const err4 = {instancePath:instancePath+"/stage",schemaPath:"#/$defs/StageReadCounts/properties/stage/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/stage",schemaPath:"#/$defs/StageReadCounts/properties/stage/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
else {
const err6 = {instancePath,schemaPath:"#/$defs/StageReadCounts/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
validate70.errors = vErrors;
return errors === 0;
}
validate70.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate69(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate69.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.target_id === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/ReadCountsByStageForTarget/required",keyword:"required",params:{missingProperty: "target_id"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.stages === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/ReadCountsByStageForTarget/required",keyword:"required",params:{missingProperty: "stages"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.stages !== undefined){
let data0 = data.stages;
if(Array.isArray(data0)){
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
if(!(validate70(data0[i0], {instancePath:instancePath+"/stages/" + i0,parentData:data0,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate70.errors : vErrors.concat(validate70.errors);
errors = vErrors.length;
}
}
}
else {
const err2 = {instancePath:instancePath+"/stages",schemaPath:"#/$defs/ReadCountsByStageForTarget/properties/stages/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(data.target_id !== undefined){
let data2 = data.target_id;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
const err3 = {instancePath:instancePath+"/target_id",schemaPath:"#/$defs/ReadCountsByStageForTarget/properties/target_id/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 < 0 || isNaN(data2)){
const err4 = {instancePath:instancePath+"/target_id",schemaPath:"#/$defs/ReadCountsByStageForTarget/properties/target_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(typeof data2 === "string"){
if(!pattern7.test(data2)){
const err5 = {instancePath:instancePath+"/target_id",schemaPath:"#/$defs/ReadCountsByStageForTarget/properties/target_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
}
else {
const err6 = {instancePath,schemaPath:"#/$defs/ReadCountsByStageForTarget/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
validate69.errors = vErrors;
return errors === 0;
}
validate69.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate68(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate68.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.library_sample_id === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/ReadCountsByStageForLibrarySample/required",keyword:"required",params:{missingProperty: "library_sample_id"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.total_raw_count === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/ReadCountsByStageForLibrarySample/required",keyword:"required",params:{missingProperty: "total_raw_count"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.library_sample_id !== undefined){
let data0 = data.library_sample_id;
if(!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))){
const err2 = {instancePath:instancePath+"/library_sample_id",schemaPath:"#/$defs/ReadCountsByStageForLibrarySample/properties/library_sample_id/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 < 0 || isNaN(data0)){
const err3 = {instancePath:instancePath+"/library_sample_id",schemaPath:"#/$defs/ReadCountsByStageForLibrarySample/properties/library_sample_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
if(typeof data0 === "string"){
if(!pattern7.test(data0)){
const err4 = {instancePath:instancePath+"/library_sample_id",schemaPath:"#/$defs/ReadCountsByStageForLibrarySample/properties/library_sample_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
if(data.read_counts_for_targets !== undefined){
let data1 = data.read_counts_for_targets;
if((!(Array.isArray(data1))) && (data1 !== null)){
const err5 = {instancePath:instancePath+"/read_counts_for_targets",schemaPath:"#/$defs/ReadCountsByStageForLibrarySample/properties/read_counts_for_targets/type",keyword:"type",params:{type: schema30.properties.read_counts_for_targets.type}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(Array.isArray(data1)){
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
if(!(validate69(data1[i0], {instancePath:instancePath+"/read_counts_for_targets/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate69.errors : vErrors.concat(validate69.errors);
errors = vErrors.length;
}
}
}
}
if(data.total_raw_count !== undefined){
let data3 = data.total_raw_count;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
const err6 = {instancePath:instancePath+"/total_raw_count",schemaPath:"#/$defs/ReadCountsByStageForLibrarySample/properties/total_raw_count/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 < 0 || isNaN(data3)){
const err7 = {instancePath:instancePath+"/total_raw_count",schemaPath:"#/$defs/ReadCountsByStageForLibrarySample/properties/total_raw_count/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(typeof data3 === "string"){
if(!pattern7.test(data3)){
const err8 = {instancePath:instancePath+"/total_raw_count",schemaPath:"#/$defs/ReadCountsByStageForLibrarySample/properties/total_raw_count/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
}
else {
const err9 = {instancePath,schemaPath:"#/$defs/ReadCountsByStageForLibrarySample/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
validate68.errors = vErrors;
return errors === 0;
}
validate68.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate67(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate67.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.read_counts_by_library_sample_by_stage === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/ReadCountsByStage/required",keyword:"required",params:{missingProperty: "read_counts_by_library_sample_by_stage"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.bioinformatics_run_id !== undefined){
let data0 = data.bioinformatics_run_id;
if((!(((typeof data0 == "number") && (!(data0 % 1) && !isNaN(data0))) && (isFinite(data0)))) && (data0 !== null)){
const err1 = {instancePath:instancePath+"/bioinformatics_run_id",schemaPath:"#/$defs/ReadCountsByStage/properties/bioinformatics_run_id/type",keyword:"type",params:{type: schema29.properties.bioinformatics_run_id.type}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 < 0 || isNaN(data0)){
const err2 = {instancePath:instancePath+"/bioinformatics_run_id",schemaPath:"#/$defs/ReadCountsByStage/properties/bioinformatics_run_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
if(typeof data0 === "string"){
if(!pattern7.test(data0)){
const err3 = {instancePath:instancePath+"/bioinformatics_run_id",schemaPath:"#/$defs/ReadCountsByStage/properties/bioinformatics_run_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
if(data.read_counts_by_library_sample_by_stage !== undefined){
let data1 = data.read_counts_by_library_sample_by_stage;
if(Array.isArray(data1)){
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
if(!(validate68(data1[i0], {instancePath:instancePath+"/read_counts_by_library_sample_by_stage/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate68.errors : vErrors.concat(validate68.errors);
errors = vErrors.length;
}
}
}
else {
const err4 = {instancePath:instancePath+"/read_counts_by_library_sample_by_stage",schemaPath:"#/$defs/ReadCountsByStage/properties/read_counts_by_library_sample_by_stage/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
else {
const err5 = {instancePath,schemaPath:"#/$defs/ReadCountsByStage/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
validate67.errors = vErrors;
return errors === 0;
}
validate67.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema33 = {"additionalProperties":true,"properties":{"targets":{"items":{"$ref":"#/$defs/RepresentativeMicrohaplotypesForTarget"},"type":"array"}},"required":["targets"],"type":"object"};
const schema34 = {"additionalProperties":true,"properties":{"mhap_location":{"anyOf":[{"$ref":"#/$defs/GenomicLocation"},{"type":"null"}]},"microhaplotypes":{"items":{"$ref":"#/$defs/RepresentativeMicrohaplotype"},"type":"array"},"target_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"}},"required":["target_id","microhaplotypes"],"type":"object"};
const schema35 = {"additionalProperties":true,"properties":{"alt_seq":{"pattern":"^[A-z-]+(?=\\n?$)","type":["string","null"]},"chrom":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"},"end":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"genome_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"ref_seq":{"pattern":"^[A-z-]+(?=\\n?$)","type":["string","null"]},"start":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"strand":{"pattern":"[+-]","type":["string","null"]}},"required":["genome_id","chrom","start","end"],"type":"object"};
const pattern45 = new RegExp("^[A-z-]+(?=\\n?$)", "u");
const pattern51 = new RegExp("[+-]", "u");

function validate77(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate77.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.genome_id === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/GenomicLocation/required",keyword:"required",params:{missingProperty: "genome_id"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.chrom === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/GenomicLocation/required",keyword:"required",params:{missingProperty: "chrom"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.start === undefined){
const err2 = {instancePath,schemaPath:"#/$defs/GenomicLocation/required",keyword:"required",params:{missingProperty: "start"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.end === undefined){
const err3 = {instancePath,schemaPath:"#/$defs/GenomicLocation/required",keyword:"required",params:{missingProperty: "end"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.alt_seq !== undefined){
let data0 = data.alt_seq;
if((typeof data0 !== "string") && (data0 !== null)){
const err4 = {instancePath:instancePath+"/alt_seq",schemaPath:"#/$defs/GenomicLocation/properties/alt_seq/type",keyword:"type",params:{type: schema35.properties.alt_seq.type}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(typeof data0 === "string"){
if(!pattern45.test(data0)){
const err5 = {instancePath:instancePath+"/alt_seq",schemaPath:"#/$defs/GenomicLocation/properties/alt_seq/pattern",keyword:"pattern",params:{pattern: "^[A-z-]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
}
if(data.chrom !== undefined){
let data1 = data.chrom;
if(typeof data1 === "string"){
if(!pattern15.test(data1)){
const err6 = {instancePath:instancePath+"/chrom",schemaPath:"#/$defs/GenomicLocation/properties/chrom/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
else {
const err7 = {instancePath:instancePath+"/chrom",schemaPath:"#/$defs/GenomicLocation/properties/chrom/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.end !== undefined){
let data2 = data.end;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
const err8 = {instancePath:instancePath+"/end",schemaPath:"#/$defs/GenomicLocation/properties/end/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 < 0 || isNaN(data2)){
const err9 = {instancePath:instancePath+"/end",schemaPath:"#/$defs/GenomicLocation/properties/end/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(typeof data2 === "string"){
if(!pattern7.test(data2)){
const err10 = {instancePath:instancePath+"/end",schemaPath:"#/$defs/GenomicLocation/properties/end/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
if(data.genome_id !== undefined){
let data3 = data.genome_id;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
const err11 = {instancePath:instancePath+"/genome_id",schemaPath:"#/$defs/GenomicLocation/properties/genome_id/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 < 0 || isNaN(data3)){
const err12 = {instancePath:instancePath+"/genome_id",schemaPath:"#/$defs/GenomicLocation/properties/genome_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(typeof data3 === "string"){
if(!pattern7.test(data3)){
const err13 = {instancePath:instancePath+"/genome_id",schemaPath:"#/$defs/GenomicLocation/properties/genome_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
if(data.ref_seq !== undefined){
let data4 = data.ref_seq;
if((typeof data4 !== "string") && (data4 !== null)){
const err14 = {instancePath:instancePath+"/ref_seq",schemaPath:"#/$defs/GenomicLocation/properties/ref_seq/type",keyword:"type",params:{type: schema35.properties.ref_seq.type}};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(typeof data4 === "string"){
if(!pattern45.test(data4)){
const err15 = {instancePath:instancePath+"/ref_seq",schemaPath:"#/$defs/GenomicLocation/properties/ref_seq/pattern",keyword:"pattern",params:{pattern: "^[A-z-]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
if(data.start !== undefined){
let data5 = data.start;
if(!(((typeof data5 == "number") && (!(data5 % 1) && !isNaN(data5))) && (isFinite(data5)))){
const err16 = {instancePath:instancePath+"/start",schemaPath:"#/$defs/GenomicLocation/properties/start/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if((typeof data5 == "number") && (isFinite(data5))){
if(data5 < 0 || isNaN(data5)){
const err17 = {instancePath:instancePath+"/start",schemaPath:"#/$defs/GenomicLocation/properties/start/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
if(typeof data5 === "string"){
if(!pattern7.test(data5)){
const err18 = {instancePath:instancePath+"/start",schemaPath:"#/$defs/GenomicLocation/properties/start/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
if(data.strand !== undefined){
let data6 = data.strand;
if((typeof data6 !== "string") && (data6 !== null)){
const err19 = {instancePath:instancePath+"/strand",schemaPath:"#/$defs/GenomicLocation/properties/strand/type",keyword:"type",params:{type: schema35.properties.strand.type}};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(typeof data6 === "string"){
if(!pattern51.test(data6)){
const err20 = {instancePath:instancePath+"/strand",schemaPath:"#/$defs/GenomicLocation/properties/strand/pattern",keyword:"pattern",params:{pattern: "[+-]"}};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
}
}
else {
const err21 = {instancePath,schemaPath:"#/$defs/GenomicLocation/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
validate77.errors = vErrors;
return errors === 0;
}
validate77.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema36 = {"additionalProperties":true,"properties":{"alt_annotations":{"items":{"type":"string"},"type":["array","null"]},"associated_protein_variants":{"items":{"$ref":"#/$defs/ProteinVariant"},"type":["array","null"]},"associated_seq_variants":{"items":{"$ref":"#/$defs/GenomicLocation"},"type":["array","null"]},"masking":{"items":{"$ref":"#/$defs/MaskingInfo"},"type":["array","null"]},"microhaplotype_name":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":["string","null"]},"pseudocigar":{"anyOf":[{"$ref":"#/$defs/Pseudocigar"},{"type":"null"}]},"quality":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":["string","null"]},"seq":{"pattern":"^[A-z]+(?=\\n?$)","type":"string"}},"required":["seq"],"type":"object"};
const schema37 = {"additionalProperties":true,"properties":{"alternative_gene_name":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":["string","null"]},"codon_genomic_location":{"anyOf":[{"$ref":"#/$defs/GenomicLocation"},{"type":"null"}]},"gene_name":{"pattern":"^[A-z-._0-9:]+(?=\\n?$)","type":["string","null"]},"protein_location":{"$ref":"#/$defs/GenomicLocation"}},"required":["protein_location"],"type":"object"};
const pattern53 = new RegExp("^[A-z-._0-9:]+(?=\\n?$)", "u");

function validate80(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate80.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.protein_location === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/ProteinVariant/required",keyword:"required",params:{missingProperty: "protein_location"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.alternative_gene_name !== undefined){
let data0 = data.alternative_gene_name;
if((typeof data0 !== "string") && (data0 !== null)){
const err1 = {instancePath:instancePath+"/alternative_gene_name",schemaPath:"#/$defs/ProteinVariant/properties/alternative_gene_name/type",keyword:"type",params:{type: schema37.properties.alternative_gene_name.type}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(typeof data0 === "string"){
if(!pattern15.test(data0)){
const err2 = {instancePath:instancePath+"/alternative_gene_name",schemaPath:"#/$defs/ProteinVariant/properties/alternative_gene_name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
if(data.codon_genomic_location !== undefined){
let data1 = data.codon_genomic_location;
const _errs5 = errors;
let valid1 = false;
const _errs6 = errors;
if(!(validate77(data1, {instancePath:instancePath+"/codon_genomic_location",parentData:data,parentDataProperty:"codon_genomic_location",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate77.errors : vErrors.concat(validate77.errors);
errors = vErrors.length;
}
var _valid0 = _errs6 === errors;
valid1 = valid1 || _valid0;
const _errs7 = errors;
if(data1 !== null){
const err3 = {instancePath:instancePath+"/codon_genomic_location",schemaPath:"#/$defs/ProteinVariant/properties/codon_genomic_location/anyOf/1/type",keyword:"type",params:{type: "null"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
var _valid0 = _errs7 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err4 = {instancePath:instancePath+"/codon_genomic_location",schemaPath:"#/$defs/ProteinVariant/properties/codon_genomic_location/anyOf",keyword:"anyOf",params:{}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
else {
errors = _errs5;
if(vErrors !== null){
if(_errs5){
vErrors.length = _errs5;
}
else {
vErrors = null;
}
}
}
}
if(data.gene_name !== undefined){
let data2 = data.gene_name;
if((typeof data2 !== "string") && (data2 !== null)){
const err5 = {instancePath:instancePath+"/gene_name",schemaPath:"#/$defs/ProteinVariant/properties/gene_name/type",keyword:"type",params:{type: schema37.properties.gene_name.type}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(typeof data2 === "string"){
if(!pattern53.test(data2)){
const err6 = {instancePath:instancePath+"/gene_name",schemaPath:"#/$defs/ProteinVariant/properties/gene_name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9:]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
}
if(data.protein_location !== undefined){
if(!(validate77(data.protein_location, {instancePath:instancePath+"/protein_location",parentData:data,parentDataProperty:"protein_location",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate77.errors : vErrors.concat(validate77.errors);
errors = vErrors.length;
}
}
}
else {
const err7 = {instancePath,schemaPath:"#/$defs/ProteinVariant/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
validate80.errors = vErrors;
return errors === 0;
}
validate80.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema38 = {"additionalProperties":true,"properties":{"masking_generation_description":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"replacement_size":{"minimum":0,"type":"integer"},"seq_segment_size":{"minimum":0,"type":"integer"},"seq_start":{"minimum":0,"type":"integer"}},"required":["seq_start","seq_segment_size","replacement_size"],"type":"object"};

function validate85(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate85.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.seq_start === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/MaskingInfo/required",keyword:"required",params:{missingProperty: "seq_start"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.seq_segment_size === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/MaskingInfo/required",keyword:"required",params:{missingProperty: "seq_segment_size"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.replacement_size === undefined){
const err2 = {instancePath,schemaPath:"#/$defs/MaskingInfo/required",keyword:"required",params:{missingProperty: "replacement_size"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.masking_generation_description !== undefined){
let data0 = data.masking_generation_description;
if((typeof data0 !== "string") && (data0 !== null)){
const err3 = {instancePath:instancePath+"/masking_generation_description",schemaPath:"#/$defs/MaskingInfo/properties/masking_generation_description/type",keyword:"type",params:{type: schema38.properties.masking_generation_description.type}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err4 = {instancePath:instancePath+"/masking_generation_description",schemaPath:"#/$defs/MaskingInfo/properties/masking_generation_description/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
if(data.replacement_size !== undefined){
let data1 = data.replacement_size;
if(!(((typeof data1 == "number") && (!(data1 % 1) && !isNaN(data1))) && (isFinite(data1)))){
const err5 = {instancePath:instancePath+"/replacement_size",schemaPath:"#/$defs/MaskingInfo/properties/replacement_size/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if((typeof data1 == "number") && (isFinite(data1))){
if(data1 < 0 || isNaN(data1)){
const err6 = {instancePath:instancePath+"/replacement_size",schemaPath:"#/$defs/MaskingInfo/properties/replacement_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
}
if(data.seq_segment_size !== undefined){
let data2 = data.seq_segment_size;
if(!(((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2))) && (isFinite(data2)))){
const err7 = {instancePath:instancePath+"/seq_segment_size",schemaPath:"#/$defs/MaskingInfo/properties/seq_segment_size/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if((typeof data2 == "number") && (isFinite(data2))){
if(data2 < 0 || isNaN(data2)){
const err8 = {instancePath:instancePath+"/seq_segment_size",schemaPath:"#/$defs/MaskingInfo/properties/seq_segment_size/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
if(data.seq_start !== undefined){
let data3 = data.seq_start;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
const err9 = {instancePath:instancePath+"/seq_start",schemaPath:"#/$defs/MaskingInfo/properties/seq_start/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 < 0 || isNaN(data3)){
const err10 = {instancePath:instancePath+"/seq_start",schemaPath:"#/$defs/MaskingInfo/properties/seq_start/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
}
else {
const err11 = {instancePath,schemaPath:"#/$defs/MaskingInfo/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
validate85.errors = vErrors;
return errors === 0;
}
validate85.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema39 = {"additionalProperties":true,"properties":{"pseudocigar_generation_description":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"pseudocigar_seq":{"pattern":"^[a-zA-Z0-9+=.]+(?=\\n?$)","type":"string"},"ref_loc":{"$ref":"#/$defs/GenomicLocation"}},"required":["pseudocigar_seq","ref_loc"],"type":"object"};
const pattern57 = new RegExp("^[a-zA-Z0-9+=.]+(?=\\n?$)", "u");

function validate87(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate87.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.pseudocigar_seq === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/Pseudocigar/required",keyword:"required",params:{missingProperty: "pseudocigar_seq"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.ref_loc === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/Pseudocigar/required",keyword:"required",params:{missingProperty: "ref_loc"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.pseudocigar_generation_description !== undefined){
let data0 = data.pseudocigar_generation_description;
if((typeof data0 !== "string") && (data0 !== null)){
const err2 = {instancePath:instancePath+"/pseudocigar_generation_description",schemaPath:"#/$defs/Pseudocigar/properties/pseudocigar_generation_description/type",keyword:"type",params:{type: schema39.properties.pseudocigar_generation_description.type}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err3 = {instancePath:instancePath+"/pseudocigar_generation_description",schemaPath:"#/$defs/Pseudocigar/properties/pseudocigar_generation_description/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
if(data.pseudocigar_seq !== undefined){
let data1 = data.pseudocigar_seq;
if(typeof data1 === "string"){
if(!pattern57.test(data1)){
const err4 = {instancePath:instancePath+"/pseudocigar_seq",schemaPath:"#/$defs/Pseudocigar/properties/pseudocigar_seq/pattern",keyword:"pattern",params:{pattern: "^[a-zA-Z0-9+=.]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
else {
const err5 = {instancePath:instancePath+"/pseudocigar_seq",schemaPath:"#/$defs/Pseudocigar/properties/pseudocigar_seq/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.ref_loc !== undefined){
if(!(validate77(data.ref_loc, {instancePath:instancePath+"/ref_loc",parentData:data,parentDataProperty:"ref_loc",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate77.errors : vErrors.concat(validate77.errors);
errors = vErrors.length;
}
}
}
else {
const err6 = {instancePath,schemaPath:"#/$defs/Pseudocigar/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
validate87.errors = vErrors;
return errors === 0;
}
validate87.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const pattern59 = new RegExp("^[A-z]+(?=\\n?$)", "u");

function validate79(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate79.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.seq === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/RepresentativeMicrohaplotype/required",keyword:"required",params:{missingProperty: "seq"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.alt_annotations !== undefined){
let data0 = data.alt_annotations;
if((!(Array.isArray(data0))) && (data0 !== null)){
const err1 = {instancePath:instancePath+"/alt_annotations",schemaPath:"#/$defs/RepresentativeMicrohaplotype/properties/alt_annotations/type",keyword:"type",params:{type: schema36.properties.alt_annotations.type}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(Array.isArray(data0)){
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
if(typeof data0[i0] !== "string"){
const err2 = {instancePath:instancePath+"/alt_annotations/" + i0,schemaPath:"#/$defs/RepresentativeMicrohaplotype/properties/alt_annotations/items/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
}
}
if(data.associated_protein_variants !== undefined){
let data2 = data.associated_protein_variants;
if((!(Array.isArray(data2))) && (data2 !== null)){
const err3 = {instancePath:instancePath+"/associated_protein_variants",schemaPath:"#/$defs/RepresentativeMicrohaplotype/properties/associated_protein_variants/type",keyword:"type",params:{type: schema36.properties.associated_protein_variants.type}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(Array.isArray(data2)){
const len1 = data2.length;
for(let i1=0; i1<len1; i1++){
if(!(validate80(data2[i1], {instancePath:instancePath+"/associated_protein_variants/" + i1,parentData:data2,parentDataProperty:i1,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate80.errors : vErrors.concat(validate80.errors);
errors = vErrors.length;
}
}
}
}
if(data.associated_seq_variants !== undefined){
let data4 = data.associated_seq_variants;
if((!(Array.isArray(data4))) && (data4 !== null)){
const err4 = {instancePath:instancePath+"/associated_seq_variants",schemaPath:"#/$defs/RepresentativeMicrohaplotype/properties/associated_seq_variants/type",keyword:"type",params:{type: schema36.properties.associated_seq_variants.type}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(Array.isArray(data4)){
const len2 = data4.length;
for(let i2=0; i2<len2; i2++){
if(!(validate77(data4[i2], {instancePath:instancePath+"/associated_seq_variants/" + i2,parentData:data4,parentDataProperty:i2,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate77.errors : vErrors.concat(validate77.errors);
errors = vErrors.length;
}
}
}
}
if(data.masking !== undefined){
let data6 = data.masking;
if((!(Array.isArray(data6))) && (data6 !== null)){
const err5 = {instancePath:instancePath+"/masking",schemaPath:"#/$defs/RepresentativeMicrohaplotype/properties/masking/type",keyword:"type",params:{type: schema36.properties.masking.type}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(Array.isArray(data6)){
const len3 = data6.length;
for(let i3=0; i3<len3; i3++){
if(!(validate85(data6[i3], {instancePath:instancePath+"/masking/" + i3,parentData:data6,parentDataProperty:i3,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate85.errors : vErrors.concat(validate85.errors);
errors = vErrors.length;
}
}
}
}
if(data.microhaplotype_name !== undefined){
let data8 = data.microhaplotype_name;
if((typeof data8 !== "string") && (data8 !== null)){
const err6 = {instancePath:instancePath+"/microhaplotype_name",schemaPath:"#/$defs/RepresentativeMicrohaplotype/properties/microhaplotype_name/type",keyword:"type",params:{type: schema36.properties.microhaplotype_name.type}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(typeof data8 === "string"){
if(!pattern15.test(data8)){
const err7 = {instancePath:instancePath+"/microhaplotype_name",schemaPath:"#/$defs/RepresentativeMicrohaplotype/properties/microhaplotype_name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
}
if(data.pseudocigar !== undefined){
let data9 = data.pseudocigar;
const _errs18 = errors;
let valid9 = false;
const _errs19 = errors;
if(!(validate87(data9, {instancePath:instancePath+"/pseudocigar",parentData:data,parentDataProperty:"pseudocigar",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate87.errors : vErrors.concat(validate87.errors);
errors = vErrors.length;
}
var _valid0 = _errs19 === errors;
valid9 = valid9 || _valid0;
const _errs20 = errors;
if(data9 !== null){
const err8 = {instancePath:instancePath+"/pseudocigar",schemaPath:"#/$defs/RepresentativeMicrohaplotype/properties/pseudocigar/anyOf/1/type",keyword:"type",params:{type: "null"}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
var _valid0 = _errs20 === errors;
valid9 = valid9 || _valid0;
if(!valid9){
const err9 = {instancePath:instancePath+"/pseudocigar",schemaPath:"#/$defs/RepresentativeMicrohaplotype/properties/pseudocigar/anyOf",keyword:"anyOf",params:{}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
else {
errors = _errs18;
if(vErrors !== null){
if(_errs18){
vErrors.length = _errs18;
}
else {
vErrors = null;
}
}
}
}
if(data.quality !== undefined){
let data10 = data.quality;
if((typeof data10 !== "string") && (data10 !== null)){
const err10 = {instancePath:instancePath+"/quality",schemaPath:"#/$defs/RepresentativeMicrohaplotype/properties/quality/type",keyword:"type",params:{type: schema36.properties.quality.type}};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
if(typeof data10 === "string"){
if(!pattern15.test(data10)){
const err11 = {instancePath:instancePath+"/quality",schemaPath:"#/$defs/RepresentativeMicrohaplotype/properties/quality/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
}
if(data.seq !== undefined){
let data11 = data.seq;
if(typeof data11 === "string"){
if(!pattern59.test(data11)){
const err12 = {instancePath:instancePath+"/seq",schemaPath:"#/$defs/RepresentativeMicrohaplotype/properties/seq/pattern",keyword:"pattern",params:{pattern: "^[A-z]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
else {
const err13 = {instancePath:instancePath+"/seq",schemaPath:"#/$defs/RepresentativeMicrohaplotype/properties/seq/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
else {
const err14 = {instancePath,schemaPath:"#/$defs/RepresentativeMicrohaplotype/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
validate79.errors = vErrors;
return errors === 0;
}
validate79.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate76(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate76.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.target_id === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/RepresentativeMicrohaplotypesForTarget/required",keyword:"required",params:{missingProperty: "target_id"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.microhaplotypes === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/RepresentativeMicrohaplotypesForTarget/required",keyword:"required",params:{missingProperty: "microhaplotypes"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.mhap_location !== undefined){
let data0 = data.mhap_location;
const _errs3 = errors;
let valid1 = false;
const _errs4 = errors;
if(!(validate77(data0, {instancePath:instancePath+"/mhap_location",parentData:data,parentDataProperty:"mhap_location",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate77.errors : vErrors.concat(validate77.errors);
errors = vErrors.length;
}
var _valid0 = _errs4 === errors;
valid1 = valid1 || _valid0;
const _errs5 = errors;
if(data0 !== null){
const err2 = {instancePath:instancePath+"/mhap_location",schemaPath:"#/$defs/RepresentativeMicrohaplotypesForTarget/properties/mhap_location/anyOf/1/type",keyword:"type",params:{type: "null"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
var _valid0 = _errs5 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err3 = {instancePath:instancePath+"/mhap_location",schemaPath:"#/$defs/RepresentativeMicrohaplotypesForTarget/properties/mhap_location/anyOf",keyword:"anyOf",params:{}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
else {
errors = _errs3;
if(vErrors !== null){
if(_errs3){
vErrors.length = _errs3;
}
else {
vErrors = null;
}
}
}
}
if(data.microhaplotypes !== undefined){
let data1 = data.microhaplotypes;
if(Array.isArray(data1)){
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
if(!(validate79(data1[i0], {instancePath:instancePath+"/microhaplotypes/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate79.errors : vErrors.concat(validate79.errors);
errors = vErrors.length;
}
}
}
else {
const err4 = {instancePath:instancePath+"/microhaplotypes",schemaPath:"#/$defs/RepresentativeMicrohaplotypesForTarget/properties/microhaplotypes/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data.target_id !== undefined){
let data3 = data.target_id;
if(!(((typeof data3 == "number") && (!(data3 % 1) && !isNaN(data3))) && (isFinite(data3)))){
const err5 = {instancePath:instancePath+"/target_id",schemaPath:"#/$defs/RepresentativeMicrohaplotypesForTarget/properties/target_id/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if((typeof data3 == "number") && (isFinite(data3))){
if(data3 < 0 || isNaN(data3)){
const err6 = {instancePath:instancePath+"/target_id",schemaPath:"#/$defs/RepresentativeMicrohaplotypesForTarget/properties/target_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(typeof data3 === "string"){
if(!pattern7.test(data3)){
const err7 = {instancePath:instancePath+"/target_id",schemaPath:"#/$defs/RepresentativeMicrohaplotypesForTarget/properties/target_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
}
}
else {
const err8 = {instancePath,schemaPath:"#/$defs/RepresentativeMicrohaplotypesForTarget/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
validate76.errors = vErrors;
return errors === 0;
}
validate76.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate75(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate75.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.targets === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/RepresentativeMicrohaplotypes/required",keyword:"required",params:{missingProperty: "targets"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.targets !== undefined){
let data0 = data.targets;
if(Array.isArray(data0)){
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
if(!(validate76(data0[i0], {instancePath:instancePath+"/targets/" + i0,parentData:data0,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate76.errors : vErrors.concat(validate76.errors);
errors = vErrors.length;
}
}
}
else {
const err1 = {instancePath:instancePath+"/targets",schemaPath:"#/$defs/RepresentativeMicrohaplotypes/properties/targets/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
}
else {
const err2 = {instancePath,schemaPath:"#/$defs/RepresentativeMicrohaplotypes/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
validate75.errors = vErrors;
return errors === 0;
}
validate75.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema40 = {"additionalProperties":true,"properties":{"library_kit":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"library_layout":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"library_screen":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"library_selection":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"library_source":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"library_strategy":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"nucl_acid_amp":{"pattern":"^(https?|ftp):\\/\\/[^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}/$.?#][^\\n][^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}]*(?=\\n?$)","type":["string","null"]},"nucl_acid_amp_date":{"pattern":"[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?","type":["string","null"]},"nucl_acid_ext":{"pattern":"^(https?|ftp):\\/\\/[^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}/$.?#][^\\n][^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}]*(?=\\n?$)","type":["string","null"]},"nucl_acid_ext_date":{"pattern":"[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?","type":["string","null"]},"pcr_cond":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"seq_center":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"seq_date":{"pattern":"[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?","type":["string","null"]},"seq_instrument_model":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"seq_platform":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"sequencing_info_name":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"}},"required":["sequencing_info_name","seq_platform","seq_instrument_model","library_layout","library_strategy","library_source","library_selection"],"type":"object"};
const pattern67 = new RegExp("^(https?|ftp):\\/\\/[^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}/$.?#][^\\n][^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}]*(?=\\n?$)", "u");

function validate93(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate93.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.sequencing_info_name === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/SequencingInfo/required",keyword:"required",params:{missingProperty: "sequencing_info_name"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.seq_platform === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/SequencingInfo/required",keyword:"required",params:{missingProperty: "seq_platform"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.seq_instrument_model === undefined){
const err2 = {instancePath,schemaPath:"#/$defs/SequencingInfo/required",keyword:"required",params:{missingProperty: "seq_instrument_model"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.library_layout === undefined){
const err3 = {instancePath,schemaPath:"#/$defs/SequencingInfo/required",keyword:"required",params:{missingProperty: "library_layout"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.library_strategy === undefined){
const err4 = {instancePath,schemaPath:"#/$defs/SequencingInfo/required",keyword:"required",params:{missingProperty: "library_strategy"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.library_source === undefined){
const err5 = {instancePath,schemaPath:"#/$defs/SequencingInfo/required",keyword:"required",params:{missingProperty: "library_source"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.library_selection === undefined){
const err6 = {instancePath,schemaPath:"#/$defs/SequencingInfo/required",keyword:"required",params:{missingProperty: "library_selection"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.library_kit !== undefined){
let data0 = data.library_kit;
if((typeof data0 !== "string") && (data0 !== null)){
const err7 = {instancePath:instancePath+"/library_kit",schemaPath:"#/$defs/SequencingInfo/properties/library_kit/type",keyword:"type",params:{type: schema40.properties.library_kit.type}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(typeof data0 === "string"){
if(!pattern4.test(data0)){
const err8 = {instancePath:instancePath+"/library_kit",schemaPath:"#/$defs/SequencingInfo/properties/library_kit/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
if(data.library_layout !== undefined){
let data1 = data.library_layout;
if(typeof data1 === "string"){
if(!pattern3.test(data1)){
const err9 = {instancePath:instancePath+"/library_layout",schemaPath:"#/$defs/SequencingInfo/properties/library_layout/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
else {
const err10 = {instancePath:instancePath+"/library_layout",schemaPath:"#/$defs/SequencingInfo/properties/library_layout/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.library_screen !== undefined){
let data2 = data.library_screen;
if((typeof data2 !== "string") && (data2 !== null)){
const err11 = {instancePath:instancePath+"/library_screen",schemaPath:"#/$defs/SequencingInfo/properties/library_screen/type",keyword:"type",params:{type: schema40.properties.library_screen.type}};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
if(typeof data2 === "string"){
if(!pattern4.test(data2)){
const err12 = {instancePath:instancePath+"/library_screen",schemaPath:"#/$defs/SequencingInfo/properties/library_screen/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
}
if(data.library_selection !== undefined){
let data3 = data.library_selection;
if(typeof data3 === "string"){
if(!pattern3.test(data3)){
const err13 = {instancePath:instancePath+"/library_selection",schemaPath:"#/$defs/SequencingInfo/properties/library_selection/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
else {
const err14 = {instancePath:instancePath+"/library_selection",schemaPath:"#/$defs/SequencingInfo/properties/library_selection/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(data.library_source !== undefined){
let data4 = data.library_source;
if(typeof data4 === "string"){
if(!pattern3.test(data4)){
const err15 = {instancePath:instancePath+"/library_source",schemaPath:"#/$defs/SequencingInfo/properties/library_source/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
else {
const err16 = {instancePath:instancePath+"/library_source",schemaPath:"#/$defs/SequencingInfo/properties/library_source/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.library_strategy !== undefined){
let data5 = data.library_strategy;
if(typeof data5 === "string"){
if(!pattern3.test(data5)){
const err17 = {instancePath:instancePath+"/library_strategy",schemaPath:"#/$defs/SequencingInfo/properties/library_strategy/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {instancePath:instancePath+"/library_strategy",schemaPath:"#/$defs/SequencingInfo/properties/library_strategy/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.nucl_acid_amp !== undefined){
let data6 = data.nucl_acid_amp;
if((typeof data6 !== "string") && (data6 !== null)){
const err19 = {instancePath:instancePath+"/nucl_acid_amp",schemaPath:"#/$defs/SequencingInfo/properties/nucl_acid_amp/type",keyword:"type",params:{type: schema40.properties.nucl_acid_amp.type}};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
if(typeof data6 === "string"){
if(!pattern67.test(data6)){
const err20 = {instancePath:instancePath+"/nucl_acid_amp",schemaPath:"#/$defs/SequencingInfo/properties/nucl_acid_amp/pattern",keyword:"pattern",params:{pattern: "^(https?|ftp):\\/\\/[^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}/$.?#][^\\n][^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}]*(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
}
if(data.nucl_acid_amp_date !== undefined){
let data7 = data.nucl_acid_amp_date;
if((typeof data7 !== "string") && (data7 !== null)){
const err21 = {instancePath:instancePath+"/nucl_acid_amp_date",schemaPath:"#/$defs/SequencingInfo/properties/nucl_acid_amp_date/type",keyword:"type",params:{type: schema40.properties.nucl_acid_amp_date.type}};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
if(typeof data7 === "string"){
if(!pattern9.test(data7)){
const err22 = {instancePath:instancePath+"/nucl_acid_amp_date",schemaPath:"#/$defs/SequencingInfo/properties/nucl_acid_amp_date/pattern",keyword:"pattern",params:{pattern: "[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?"}};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
}
}
if(data.nucl_acid_ext !== undefined){
let data8 = data.nucl_acid_ext;
if((typeof data8 !== "string") && (data8 !== null)){
const err23 = {instancePath:instancePath+"/nucl_acid_ext",schemaPath:"#/$defs/SequencingInfo/properties/nucl_acid_ext/type",keyword:"type",params:{type: schema40.properties.nucl_acid_ext.type}};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
if(typeof data8 === "string"){
if(!pattern67.test(data8)){
const err24 = {instancePath:instancePath+"/nucl_acid_ext",schemaPath:"#/$defs/SequencingInfo/properties/nucl_acid_ext/pattern",keyword:"pattern",params:{pattern: "^(https?|ftp):\\/\\/[^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}/$.?#][^\\n][^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}]*(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
if(data.nucl_acid_ext_date !== undefined){
let data9 = data.nucl_acid_ext_date;
if((typeof data9 !== "string") && (data9 !== null)){
const err25 = {instancePath:instancePath+"/nucl_acid_ext_date",schemaPath:"#/$defs/SequencingInfo/properties/nucl_acid_ext_date/type",keyword:"type",params:{type: schema40.properties.nucl_acid_ext_date.type}};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
if(typeof data9 === "string"){
if(!pattern9.test(data9)){
const err26 = {instancePath:instancePath+"/nucl_acid_ext_date",schemaPath:"#/$defs/SequencingInfo/properties/nucl_acid_ext_date/pattern",keyword:"pattern",params:{pattern: "[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?"}};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
}
}
if(data.pcr_cond !== undefined){
let data10 = data.pcr_cond;
if((typeof data10 !== "string") && (data10 !== null)){
const err27 = {instancePath:instancePath+"/pcr_cond",schemaPath:"#/$defs/SequencingInfo/properties/pcr_cond/type",keyword:"type",params:{type: schema40.properties.pcr_cond.type}};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
if(typeof data10 === "string"){
if(!pattern4.test(data10)){
const err28 = {instancePath:instancePath+"/pcr_cond",schemaPath:"#/$defs/SequencingInfo/properties/pcr_cond/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
}
if(data.seq_center !== undefined){
let data11 = data.seq_center;
if((typeof data11 !== "string") && (data11 !== null)){
const err29 = {instancePath:instancePath+"/seq_center",schemaPath:"#/$defs/SequencingInfo/properties/seq_center/type",keyword:"type",params:{type: schema40.properties.seq_center.type}};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(typeof data11 === "string"){
if(!pattern4.test(data11)){
const err30 = {instancePath:instancePath+"/seq_center",schemaPath:"#/$defs/SequencingInfo/properties/seq_center/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
}
if(data.seq_date !== undefined){
let data12 = data.seq_date;
if((typeof data12 !== "string") && (data12 !== null)){
const err31 = {instancePath:instancePath+"/seq_date",schemaPath:"#/$defs/SequencingInfo/properties/seq_date/type",keyword:"type",params:{type: schema40.properties.seq_date.type}};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if(typeof data12 === "string"){
if(!pattern9.test(data12)){
const err32 = {instancePath:instancePath+"/seq_date",schemaPath:"#/$defs/SequencingInfo/properties/seq_date/pattern",keyword:"pattern",params:{pattern: "[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?"}};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
}
if(data.seq_instrument_model !== undefined){
let data13 = data.seq_instrument_model;
if(typeof data13 === "string"){
if(!pattern3.test(data13)){
const err33 = {instancePath:instancePath+"/seq_instrument_model",schemaPath:"#/$defs/SequencingInfo/properties/seq_instrument_model/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
}
else {
const err34 = {instancePath:instancePath+"/seq_instrument_model",schemaPath:"#/$defs/SequencingInfo/properties/seq_instrument_model/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(data.seq_platform !== undefined){
let data14 = data.seq_platform;
if(typeof data14 === "string"){
if(!pattern3.test(data14)){
const err35 = {instancePath:instancePath+"/seq_platform",schemaPath:"#/$defs/SequencingInfo/properties/seq_platform/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
else {
const err36 = {instancePath:instancePath+"/seq_platform",schemaPath:"#/$defs/SequencingInfo/properties/seq_platform/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
}
if(data.sequencing_info_name !== undefined){
let data15 = data.sequencing_info_name;
if(typeof data15 === "string"){
if(!pattern3.test(data15)){
const err37 = {instancePath:instancePath+"/sequencing_info_name",schemaPath:"#/$defs/SequencingInfo/properties/sequencing_info_name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
else {
const err38 = {instancePath:instancePath+"/sequencing_info_name",schemaPath:"#/$defs/SequencingInfo/properties/sequencing_info_name/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
}
}
else {
const err39 = {instancePath,schemaPath:"#/$defs/SequencingInfo/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
validate93.errors = vErrors;
return errors === 0;
}
validate93.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema41 = {"additionalProperties":true,"properties":{"alternate_identifiers":{"items":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":"string"},"type":["array","null"]},"blood_meal":{"type":["boolean","null"]},"collection_country":{"pattern":"^[\\u{30}-\\u{39}\\u{41}-\\u{5a}\\u{5f}\\u{61}-\\u{7a}\\u{aa}\\u{b2}-\\u{b3}\\u{b5}\\u{b9}-\\u{ba}\\u{bc}-\\u{be}\\u{c0}-\\u{d6}\\u{d8}-\\u{f6}\\u{f8}-\\u{2c1}\\u{2c6}-\\u{2d1}\\u{2e0}-\\u{2e4}\\u{2ec}\\u{2ee}\\u{370}-\\u{374}\\u{376}-\\u{377}\\u{37a}-\\u{37d}\\u{37f}\\u{386}\\u{388}-\\u{38a}\\u{38c}\\u{38e}-\\u{3a1}\\u{3a3}-\\u{3f5}\\u{3f7}-\\u{481}\\u{48a}-\\u{52f}\\u{531}-\\u{556}\\u{559}\\u{560}-\\u{588}\\u{5d0}-\\u{5ea}\\u{5ef}-\\u{5f2}\\u{620}-\\u{64a}\\u{660}-\\u{669}\\u{66e}-\\u{66f}\\u{671}-\\u{6d3}\\u{6d5}\\u{6e5}-\\u{6e6}\\u{6ee}-\\u{6fc}\\u{6ff}\\u{710}\\u{712}-\\u{72f}\\u{74d}-\\u{7a5}\\u{7b1}\\u{7c0}-\\u{7ea}\\u{7f4}-\\u{7f5}\\u{7fa}\\u{800}-\\u{815}\\u{81a}\\u{824}\\u{828}\\u{840}-\\u{858}\\u{860}-\\u{86a}\\u{870}-\\u{887}\\u{889}-\\u{88e}\\u{8a0}-\\u{8c9}\\u{904}-\\u{939}\\u{93d}\\u{950}\\u{958}-\\u{961}\\u{966}-\\u{96f}\\u{971}-\\u{980}\\u{985}-\\u{98c}\\u{98f}-\\u{990}\\u{993}-\\u{9a8}\\u{9aa}-\\u{9b0}\\u{9b2}\\u{9b6}-\\u{9b9}\\u{9bd}\\u{9ce}\\u{9dc}-\\u{9dd}\\u{9df}-\\u{9e1}\\u{9e6}-\\u{9f1}\\u{9f4}-\\u{9f9}\\u{9fc}\\u{a05}-\\u{a0a}\\u{a0f}-\\u{a10}\\u{a13}-\\u{a28}\\u{a2a}-\\u{a30}\\u{a32}-\\u{a33}\\u{a35}-\\u{a36}\\u{a38}-\\u{a39}\\u{a59}-\\u{a5c}\\u{a5e}\\u{a66}-\\u{a6f}\\u{a72}-\\u{a74}\\u{a85}-\\u{a8d}\\u{a8f}-\\u{a91}\\u{a93}-\\u{aa8}\\u{aaa}-\\u{ab0}\\u{ab2}-\\u{ab3}\\u{ab5}-\\u{ab9}\\u{abd}\\u{ad0}\\u{ae0}-\\u{ae1}\\u{ae6}-\\u{aef}\\u{af9}\\u{b05}-\\u{b0c}\\u{b0f}-\\u{b10}\\u{b13}-\\u{b28}\\u{b2a}-\\u{b30}\\u{b32}-\\u{b33}\\u{b35}-\\u{b39}\\u{b3d}\\u{b5c}-\\u{b5d}\\u{b5f}-\\u{b61}\\u{b66}-\\u{b6f}\\u{b71}-\\u{b77}\\u{b83}\\u{b85}-\\u{b8a}\\u{b8e}-\\u{b90}\\u{b92}-\\u{b95}\\u{b99}-\\u{b9a}\\u{b9c}\\u{b9e}-\\u{b9f}\\u{ba3}-\\u{ba4}\\u{ba8}-\\u{baa}\\u{bae}-\\u{bb9}\\u{bd0}\\u{be6}-\\u{bf2}\\u{c05}-\\u{c0c}\\u{c0e}-\\u{c10}\\u{c12}-\\u{c28}\\u{c2a}-\\u{c39}\\u{c3d}\\u{c58}-\\u{c5a}\\u{c5d}\\u{c60}-\\u{c61}\\u{c66}-\\u{c6f}\\u{c78}-\\u{c7e}\\u{c80}\\u{c85}-\\u{c8c}\\u{c8e}-\\u{c90}\\u{c92}-\\u{ca8}\\u{caa}-\\u{cb3}\\u{cb5}-\\u{cb9}\\u{cbd}\\u{cdd}-\\u{cde}\\u{ce0}-\\u{ce1}\\u{ce6}-\\u{cef}\\u{cf1}-\\u{cf2}\\u{d04}-\\u{d0c}\\u{d0e}-\\u{d10}\\u{d12}-\\u{d3a}\\u{d3d}\\u{d4e}\\u{d54}-\\u{d56}\\u{d58}-\\u{d61}\\u{d66}-\\u{d78}\\u{d7a}-\\u{d7f}\\u{d85}-\\u{d96}\\u{d9a}-\\u{db1}\\u{db3}-\\u{dbb}\\u{dbd}\\u{dc0}-\\u{dc6}\\u{de6}-\\u{def}\\u{e01}-\\u{e30}\\u{e32}-\\u{e33}\\u{e40}-\\u{e46}\\u{e50}-\\u{e59}\\u{e81}-\\u{e82}\\u{e84}\\u{e86}-\\u{e8a}\\u{e8c}-\\u{ea3}\\u{ea5}\\u{ea7}-\\u{eb0}\\u{eb2}-\\u{eb3}\\u{ebd}\\u{ec0}-\\u{ec4}\\u{ec6}\\u{ed0}-\\u{ed9}\\u{edc}-\\u{edf}\\u{f00}\\u{f20}-\\u{f33}\\u{f40}-\\u{f47}\\u{f49}-\\u{f6c}\\u{f88}-\\u{f8c}\\u{1000}-\\u{102a}\\u{103f}-\\u{1049}\\u{1050}-\\u{1055}\\u{105a}-\\u{105d}\\u{1061}\\u{1065}-\\u{1066}\\u{106e}-\\u{1070}\\u{1075}-\\u{1081}\\u{108e}\\u{1090}-\\u{1099}\\u{10a0}-\\u{10c5}\\u{10c7}\\u{10cd}\\u{10d0}-\\u{10fa}\\u{10fc}-\\u{1248}\\u{124a}-\\u{124d}\\u{1250}-\\u{1256}\\u{1258}\\u{125a}-\\u{125d}\\u{1260}-\\u{1288}\\u{128a}-\\u{128d}\\u{1290}-\\u{12b0}\\u{12b2}-\\u{12b5}\\u{12b8}-\\u{12be}\\u{12c0}\\u{12c2}-\\u{12c5}\\u{12c8}-\\u{12d6}\\u{12d8}-\\u{1310}\\u{1312}-\\u{1315}\\u{1318}-\\u{135a}\\u{1369}-\\u{137c}\\u{1380}-\\u{138f}\\u{13a0}-\\u{13f5}\\u{13f8}-\\u{13fd}\\u{1401}-\\u{166c}\\u{166f}-\\u{167f}\\u{1681}-\\u{169a}\\u{16a0}-\\u{16ea}\\u{16ee}-\\u{16f8}\\u{1700}-\\u{1711}\\u{171f}-\\u{1731}\\u{1740}-\\u{1751}\\u{1760}-\\u{176c}\\u{176e}-\\u{1770}\\u{1780}-\\u{17b3}\\u{17d7}\\u{17dc}\\u{17e0}-\\u{17e9}\\u{17f0}-\\u{17f9}\\u{1810}-\\u{1819}\\u{1820}-\\u{1878}\\u{1880}-\\u{1884}\\u{1887}-\\u{18a8}\\u{18aa}\\u{18b0}-\\u{18f5}\\u{1900}-\\u{191e}\\u{1946}-\\u{196d}\\u{1970}-\\u{1974}\\u{1980}-\\u{19ab}\\u{19b0}-\\u{19c9}\\u{19d0}-\\u{19da}\\u{1a00}-\\u{1a16}\\u{1a20}-\\u{1a54}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1aa7}\\u{1b05}-\\u{1b33}\\u{1b45}-\\u{1b4c}\\u{1b50}-\\u{1b59}\\u{1b83}-\\u{1ba0}\\u{1bae}-\\u{1be5}\\u{1c00}-\\u{1c23}\\u{1c40}-\\u{1c49}\\u{1c4d}-\\u{1c7d}\\u{1c80}-\\u{1c88}\\u{1c90}-\\u{1cba}\\u{1cbd}-\\u{1cbf}\\u{1ce9}-\\u{1cec}\\u{1cee}-\\u{1cf3}\\u{1cf5}-\\u{1cf6}\\u{1cfa}\\u{1d00}-\\u{1dbf}\\u{1e00}-\\u{1f15}\\u{1f18}-\\u{1f1d}\\u{1f20}-\\u{1f45}\\u{1f48}-\\u{1f4d}\\u{1f50}-\\u{1f57}\\u{1f59}\\u{1f5b}\\u{1f5d}\\u{1f5f}-\\u{1f7d}\\u{1f80}-\\u{1fb4}\\u{1fb6}-\\u{1fbc}\\u{1fbe}\\u{1fc2}-\\u{1fc4}\\u{1fc6}-\\u{1fcc}\\u{1fd0}-\\u{1fd3}\\u{1fd6}-\\u{1fdb}\\u{1fe0}-\\u{1fec}\\u{1ff2}-\\u{1ff4}\\u{1ff6}-\\u{1ffc}\\u{2070}-\\u{2071}\\u{2074}-\\u{2079}\\u{207f}-\\u{2089}\\u{2090}-\\u{209c}\\u{2102}\\u{2107}\\u{210a}-\\u{2113}\\u{2115}\\u{2119}-\\u{211d}\\u{2124}\\u{2126}\\u{2128}\\u{212a}-\\u{212d}\\u{212f}-\\u{2139}\\u{213c}-\\u{213f}\\u{2145}-\\u{2149}\\u{214e}\\u{2150}-\\u{2189}\\u{2460}-\\u{249b}\\u{24ea}-\\u{24ff}\\u{2776}-\\u{2793}\\u{2c00}-\\u{2ce4}\\u{2ceb}-\\u{2cee}\\u{2cf2}-\\u{2cf3}\\u{2cfd}\\u{2d00}-\\u{2d25}\\u{2d27}\\u{2d2d}\\u{2d30}-\\u{2d67}\\u{2d6f}\\u{2d80}-\\u{2d96}\\u{2da0}-\\u{2da6}\\u{2da8}-\\u{2dae}\\u{2db0}-\\u{2db6}\\u{2db8}-\\u{2dbe}\\u{2dc0}-\\u{2dc6}\\u{2dc8}-\\u{2dce}\\u{2dd0}-\\u{2dd6}\\u{2dd8}-\\u{2dde}\\u{2e2f}\\u{3005}-\\u{3007}\\u{3021}-\\u{3029}\\u{3031}-\\u{3035}\\u{3038}-\\u{303c}\\u{3041}-\\u{3096}\\u{309d}-\\u{309f}\\u{30a1}-\\u{30fa}\\u{30fc}-\\u{30ff}\\u{3105}-\\u{312f}\\u{3131}-\\u{318e}\\u{3192}-\\u{3195}\\u{31a0}-\\u{31bf}\\u{31f0}-\\u{31ff}\\u{3220}-\\u{3229}\\u{3248}-\\u{324f}\\u{3251}-\\u{325f}\\u{3280}-\\u{3289}\\u{32b1}-\\u{32bf}\\u{3400}-\\u{4dbf}\\u{4e00}-\\u{a48c}\\u{a4d0}-\\u{a4fd}\\u{a500}-\\u{a60c}\\u{a610}-\\u{a62b}\\u{a640}-\\u{a66e}\\u{a67f}-\\u{a69d}\\u{a6a0}-\\u{a6ef}\\u{a717}-\\u{a71f}\\u{a722}-\\u{a788}\\u{a78b}-\\u{a7ca}\\u{a7d0}-\\u{a7d1}\\u{a7d3}\\u{a7d5}-\\u{a7d9}\\u{a7f2}-\\u{a801}\\u{a803}-\\u{a805}\\u{a807}-\\u{a80a}\\u{a80c}-\\u{a822}\\u{a830}-\\u{a835}\\u{a840}-\\u{a873}\\u{a882}-\\u{a8b3}\\u{a8d0}-\\u{a8d9}\\u{a8f2}-\\u{a8f7}\\u{a8fb}\\u{a8fd}-\\u{a8fe}\\u{a900}-\\u{a925}\\u{a930}-\\u{a946}\\u{a960}-\\u{a97c}\\u{a984}-\\u{a9b2}\\u{a9cf}-\\u{a9d9}\\u{a9e0}-\\u{a9e4}\\u{a9e6}-\\u{a9fe}\\u{aa00}-\\u{aa28}\\u{aa40}-\\u{aa42}\\u{aa44}-\\u{aa4b}\\u{aa50}-\\u{aa59}\\u{aa60}-\\u{aa76}\\u{aa7a}\\u{aa7e}-\\u{aaaf}\\u{aab1}\\u{aab5}-\\u{aab6}\\u{aab9}-\\u{aabd}\\u{aac0}\\u{aac2}\\u{aadb}-\\u{aadd}\\u{aae0}-\\u{aaea}\\u{aaf2}-\\u{aaf4}\\u{ab01}-\\u{ab06}\\u{ab09}-\\u{ab0e}\\u{ab11}-\\u{ab16}\\u{ab20}-\\u{ab26}\\u{ab28}-\\u{ab2e}\\u{ab30}-\\u{ab5a}\\u{ab5c}-\\u{ab69}\\u{ab70}-\\u{abe2}\\u{abf0}-\\u{abf9}\\u{ac00}-\\u{d7a3}\\u{d7b0}-\\u{d7c6}\\u{d7cb}-\\u{d7fb}\\u{f900}-\\u{fa6d}\\u{fa70}-\\u{fad9}\\u{fb00}-\\u{fb06}\\u{fb13}-\\u{fb17}\\u{fb1d}\\u{fb1f}-\\u{fb28}\\u{fb2a}-\\u{fb36}\\u{fb38}-\\u{fb3c}\\u{fb3e}\\u{fb40}-\\u{fb41}\\u{fb43}-\\u{fb44}\\u{fb46}-\\u{fbb1}\\u{fbd3}-\\u{fd3d}\\u{fd50}-\\u{fd8f}\\u{fd92}-\\u{fdc7}\\u{fdf0}-\\u{fdfb}\\u{fe70}-\\u{fe74}\\u{fe76}-\\u{fefc}\\u{ff10}-\\u{ff19}\\u{ff21}-\\u{ff3a}\\u{ff41}-\\u{ff5a}\\u{ff66}-\\u{ffbe}\\u{ffc2}-\\u{ffc7}\\u{ffca}-\\u{ffcf}\\u{ffd2}-\\u{ffd7}\\u{ffda}-\\u{ffdc}\\u{10000}-\\u{1000b}\\u{1000d}-\\u{10026}\\u{10028}-\\u{1003a}\\u{1003c}-\\u{1003d}\\u{1003f}-\\u{1004d}\\u{10050}-\\u{1005d}\\u{10080}-\\u{100fa}\\u{10107}-\\u{10133}\\u{10140}-\\u{10178}\\u{1018a}-\\u{1018b}\\u{10280}-\\u{1029c}\\u{102a0}-\\u{102d0}\\u{102e1}-\\u{102fb}\\u{10300}-\\u{10323}\\u{1032d}-\\u{1034a}\\u{10350}-\\u{10375}\\u{10380}-\\u{1039d}\\u{103a0}-\\u{103c3}\\u{103c8}-\\u{103cf}\\u{103d1}-\\u{103d5}\\u{10400}-\\u{1049d}\\u{104a0}-\\u{104a9}\\u{104b0}-\\u{104d3}\\u{104d8}-\\u{104fb}\\u{10500}-\\u{10527}\\u{10530}-\\u{10563}\\u{10570}-\\u{1057a}\\u{1057c}-\\u{1058a}\\u{1058c}-\\u{10592}\\u{10594}-\\u{10595}\\u{10597}-\\u{105a1}\\u{105a3}-\\u{105b1}\\u{105b3}-\\u{105b9}\\u{105bb}-\\u{105bc}\\u{10600}-\\u{10736}\\u{10740}-\\u{10755}\\u{10760}-\\u{10767}\\u{10780}-\\u{10785}\\u{10787}-\\u{107b0}\\u{107b2}-\\u{107ba}\\u{10800}-\\u{10805}\\u{10808}\\u{1080a}-\\u{10835}\\u{10837}-\\u{10838}\\u{1083c}\\u{1083f}-\\u{10855}\\u{10858}-\\u{10876}\\u{10879}-\\u{1089e}\\u{108a7}-\\u{108af}\\u{108e0}-\\u{108f2}\\u{108f4}-\\u{108f5}\\u{108fb}-\\u{1091b}\\u{10920}-\\u{10939}\\u{10980}-\\u{109b7}\\u{109bc}-\\u{109cf}\\u{109d2}-\\u{10a00}\\u{10a10}-\\u{10a13}\\u{10a15}-\\u{10a17}\\u{10a19}-\\u{10a35}\\u{10a40}-\\u{10a48}\\u{10a60}-\\u{10a7e}\\u{10a80}-\\u{10a9f}\\u{10ac0}-\\u{10ac7}\\u{10ac9}-\\u{10ae4}\\u{10aeb}-\\u{10aef}\\u{10b00}-\\u{10b35}\\u{10b40}-\\u{10b55}\\u{10b58}-\\u{10b72}\\u{10b78}-\\u{10b91}\\u{10ba9}-\\u{10baf}\\u{10c00}-\\u{10c48}\\u{10c80}-\\u{10cb2}\\u{10cc0}-\\u{10cf2}\\u{10cfa}-\\u{10d23}\\u{10d30}-\\u{10d39}\\u{10e60}-\\u{10e7e}\\u{10e80}-\\u{10ea9}\\u{10eb0}-\\u{10eb1}\\u{10f00}-\\u{10f27}\\u{10f30}-\\u{10f45}\\u{10f51}-\\u{10f54}\\u{10f70}-\\u{10f81}\\u{10fb0}-\\u{10fcb}\\u{10fe0}-\\u{10ff6}\\u{11003}-\\u{11037}\\u{11052}-\\u{1106f}\\u{11071}-\\u{11072}\\u{11075}\\u{11083}-\\u{110af}\\u{110d0}-\\u{110e8}\\u{110f0}-\\u{110f9}\\u{11103}-\\u{11126}\\u{11136}-\\u{1113f}\\u{11144}\\u{11147}\\u{11150}-\\u{11172}\\u{11176}\\u{11183}-\\u{111b2}\\u{111c1}-\\u{111c4}\\u{111d0}-\\u{111da}\\u{111dc}\\u{111e1}-\\u{111f4}\\u{11200}-\\u{11211}\\u{11213}-\\u{1122b}\\u{1123f}-\\u{11240}\\u{11280}-\\u{11286}\\u{11288}\\u{1128a}-\\u{1128d}\\u{1128f}-\\u{1129d}\\u{1129f}-\\u{112a8}\\u{112b0}-\\u{112de}\\u{112f0}-\\u{112f9}\\u{11305}-\\u{1130c}\\u{1130f}-\\u{11310}\\u{11313}-\\u{11328}\\u{1132a}-\\u{11330}\\u{11332}-\\u{11333}\\u{11335}-\\u{11339}\\u{1133d}\\u{11350}\\u{1135d}-\\u{11361}\\u{11400}-\\u{11434}\\u{11447}-\\u{1144a}\\u{11450}-\\u{11459}\\u{1145f}-\\u{11461}\\u{11480}-\\u{114af}\\u{114c4}-\\u{114c5}\\u{114c7}\\u{114d0}-\\u{114d9}\\u{11580}-\\u{115ae}\\u{115d8}-\\u{115db}\\u{11600}-\\u{1162f}\\u{11644}\\u{11650}-\\u{11659}\\u{11680}-\\u{116aa}\\u{116b8}\\u{116c0}-\\u{116c9}\\u{11700}-\\u{1171a}\\u{11730}-\\u{1173b}\\u{11740}-\\u{11746}\\u{11800}-\\u{1182b}\\u{118a0}-\\u{118f2}\\u{118ff}-\\u{11906}\\u{11909}\\u{1190c}-\\u{11913}\\u{11915}-\\u{11916}\\u{11918}-\\u{1192f}\\u{1193f}\\u{11941}\\u{11950}-\\u{11959}\\u{119a0}-\\u{119a7}\\u{119aa}-\\u{119d0}\\u{119e1}\\u{119e3}\\u{11a00}\\u{11a0b}-\\u{11a32}\\u{11a3a}\\u{11a50}\\u{11a5c}-\\u{11a89}\\u{11a9d}\\u{11ab0}-\\u{11af8}\\u{11c00}-\\u{11c08}\\u{11c0a}-\\u{11c2e}\\u{11c40}\\u{11c50}-\\u{11c6c}\\u{11c72}-\\u{11c8f}\\u{11d00}-\\u{11d06}\\u{11d08}-\\u{11d09}\\u{11d0b}-\\u{11d30}\\u{11d46}\\u{11d50}-\\u{11d59}\\u{11d60}-\\u{11d65}\\u{11d67}-\\u{11d68}\\u{11d6a}-\\u{11d89}\\u{11d98}\\u{11da0}-\\u{11da9}\\u{11ee0}-\\u{11ef2}\\u{11f02}\\u{11f04}-\\u{11f10}\\u{11f12}-\\u{11f33}\\u{11f50}-\\u{11f59}\\u{11fb0}\\u{11fc0}-\\u{11fd4}\\u{12000}-\\u{12399}\\u{12400}-\\u{1246e}\\u{12480}-\\u{12543}\\u{12f90}-\\u{12ff0}\\u{13000}-\\u{1342f}\\u{13441}-\\u{13446}\\u{14400}-\\u{14646}\\u{16800}-\\u{16a38}\\u{16a40}-\\u{16a5e}\\u{16a60}-\\u{16a69}\\u{16a70}-\\u{16abe}\\u{16ac0}-\\u{16ac9}\\u{16ad0}-\\u{16aed}\\u{16b00}-\\u{16b2f}\\u{16b40}-\\u{16b43}\\u{16b50}-\\u{16b59}\\u{16b5b}-\\u{16b61}\\u{16b63}-\\u{16b77}\\u{16b7d}-\\u{16b8f}\\u{16e40}-\\u{16e96}\\u{16f00}-\\u{16f4a}\\u{16f50}\\u{16f93}-\\u{16f9f}\\u{16fe0}-\\u{16fe1}\\u{16fe3}\\u{17000}-\\u{187f7}\\u{18800}-\\u{18cd5}\\u{18d00}-\\u{18d08}\\u{1aff0}-\\u{1aff3}\\u{1aff5}-\\u{1affb}\\u{1affd}-\\u{1affe}\\u{1b000}-\\u{1b122}\\u{1b132}\\u{1b150}-\\u{1b152}\\u{1b155}\\u{1b164}-\\u{1b167}\\u{1b170}-\\u{1b2fb}\\u{1bc00}-\\u{1bc6a}\\u{1bc70}-\\u{1bc7c}\\u{1bc80}-\\u{1bc88}\\u{1bc90}-\\u{1bc99}\\u{1d2c0}-\\u{1d2d3}\\u{1d2e0}-\\u{1d2f3}\\u{1d360}-\\u{1d378}\\u{1d400}-\\u{1d454}\\u{1d456}-\\u{1d49c}\\u{1d49e}-\\u{1d49f}\\u{1d4a2}\\u{1d4a5}-\\u{1d4a6}\\u{1d4a9}-\\u{1d4ac}\\u{1d4ae}-\\u{1d4b9}\\u{1d4bb}\\u{1d4bd}-\\u{1d4c3}\\u{1d4c5}-\\u{1d505}\\u{1d507}-\\u{1d50a}\\u{1d50d}-\\u{1d514}\\u{1d516}-\\u{1d51c}\\u{1d51e}-\\u{1d539}\\u{1d53b}-\\u{1d53e}\\u{1d540}-\\u{1d544}\\u{1d546}\\u{1d54a}-\\u{1d550}\\u{1d552}-\\u{1d6a5}\\u{1d6a8}-\\u{1d6c0}\\u{1d6c2}-\\u{1d6da}\\u{1d6dc}-\\u{1d6fa}\\u{1d6fc}-\\u{1d714}\\u{1d716}-\\u{1d734}\\u{1d736}-\\u{1d74e}\\u{1d750}-\\u{1d76e}\\u{1d770}-\\u{1d788}\\u{1d78a}-\\u{1d7a8}\\u{1d7aa}-\\u{1d7c2}\\u{1d7c4}-\\u{1d7cb}\\u{1d7ce}-\\u{1d7ff}\\u{1df00}-\\u{1df1e}\\u{1df25}-\\u{1df2a}\\u{1e030}-\\u{1e06d}\\u{1e100}-\\u{1e12c}\\u{1e137}-\\u{1e13d}\\u{1e140}-\\u{1e149}\\u{1e14e}\\u{1e290}-\\u{1e2ad}\\u{1e2c0}-\\u{1e2eb}\\u{1e2f0}-\\u{1e2f9}\\u{1e4d0}-\\u{1e4eb}\\u{1e4f0}-\\u{1e4f9}\\u{1e7e0}-\\u{1e7e6}\\u{1e7e8}-\\u{1e7eb}\\u{1e7ed}-\\u{1e7ee}\\u{1e7f0}-\\u{1e7fe}\\u{1e800}-\\u{1e8c4}\\u{1e8c7}-\\u{1e8cf}\\u{1e900}-\\u{1e943}\\u{1e94b}\\u{1e950}-\\u{1e959}\\u{1ec71}-\\u{1ecab}\\u{1ecad}-\\u{1ecaf}\\u{1ecb1}-\\u{1ecb4}\\u{1ed01}-\\u{1ed2d}\\u{1ed2f}-\\u{1ed3d}\\u{1ee00}-\\u{1ee03}\\u{1ee05}-\\u{1ee1f}\\u{1ee21}-\\u{1ee22}\\u{1ee24}\\u{1ee27}\\u{1ee29}-\\u{1ee32}\\u{1ee34}-\\u{1ee37}\\u{1ee39}\\u{1ee3b}\\u{1ee42}\\u{1ee47}\\u{1ee49}\\u{1ee4b}\\u{1ee4d}-\\u{1ee4f}\\u{1ee51}-\\u{1ee52}\\u{1ee54}\\u{1ee57}\\u{1ee59}\\u{1ee5b}\\u{1ee5d}\\u{1ee5f}\\u{1ee61}-\\u{1ee62}\\u{1ee64}\\u{1ee67}-\\u{1ee6a}\\u{1ee6c}-\\u{1ee72}\\u{1ee74}-\\u{1ee77}\\u{1ee79}-\\u{1ee7c}\\u{1ee7e}\\u{1ee80}-\\u{1ee89}\\u{1ee8b}-\\u{1ee9b}\\u{1eea1}-\\u{1eea3}\\u{1eea5}-\\u{1eea9}\\u{1eeab}-\\u{1eebb}\\u{1f100}-\\u{1f10c}\\u{1fbf0}-\\u{1fbf9}\\u{20000}-\\u{2a6df}\\u{2a700}-\\u{2b739}\\u{2b740}-\\u{2b81d}\\u{2b820}-\\u{2cea1}\\u{2ceb0}-\\u{2ebe0}\\u{2ebf0}-\\u{2ee5d}\\u{2f800}-\\u{2fa1d}\\u{30000}-\\u{3134a}\\u{31350}-\\u{323af} ,._:'–-]+(?=\\n?$)","type":["string","null"]},"collection_date":{"pattern":"(?:[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?)?|NA)","type":["string","null"]},"drug_usage":{"items":{"pattern":"^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)","type":"string"},"type":["array","null"]},"env_broad_scale":{"pattern":"^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"env_local_scale":{"pattern":"^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"env_medium":{"pattern":"^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"geo_admin1":{"type":["string","null"]},"geo_admin2":{"type":["string","null"]},"geo_admin3":{"type":["string","null"]},"gravid":{"type":["boolean","null"]},"gravidity":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":["integer","null"]},"has_travel_out_six_month":{"type":["boolean","null"]},"host_age":{"minimum":0,"pattern":"^[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]*\\.?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+(?=\\n?$)","type":["number","null"]},"host_sex":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":["string","null"]},"host_subject_name":{"minimum":0,"type":["string","null"]},"host_taxon_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":["integer","null"]},"lat_lon":{"pattern":"^[-+]?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{1,2}(?:\\.[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+)?,[-+]?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{1,3}(?:\\.[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+)?(?=\\n?$)","type":["string","null"]},"parasite_density_info":{"items":{"$ref":"#/$defs/ParasiteDensity"},"type":["array","null"]},"project_id":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":["integer","null"]},"specimen_accession":{"pattern":"^[A-z-._0-9 ]+(?=\\n?$)","type":["string","null"]},"specimen_collect_device":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"specimen_comments":{"items":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":"string"},"type":["array","null"]},"specimen_name":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":"string"},"specimen_store_loc":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"specimen_taxon_id":{"items":{"minimum":0,"pattern":"^[0-9]+(?=\\n?$)","type":"integer"},"type":["array","null"]},"specimen_type":{"pattern":"^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)","type":["string","null"]},"storage_plate_info":{"anyOf":[{"$ref":"#/$defs/PlateInfo"},{"type":"null"}]},"travel_out_six_month":{"items":{"$ref":"#/$defs/TravelInfo"},"type":["array","null"]},"treatment_status":{"items":{"pattern":"^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)","type":"string"},"type":["array","null"]}},"required":["specimen_name"],"type":"object"};
const pattern78 = new RegExp("^[\\u{30}-\\u{39}\\u{41}-\\u{5a}\\u{5f}\\u{61}-\\u{7a}\\u{aa}\\u{b2}-\\u{b3}\\u{b5}\\u{b9}-\\u{ba}\\u{bc}-\\u{be}\\u{c0}-\\u{d6}\\u{d8}-\\u{f6}\\u{f8}-\\u{2c1}\\u{2c6}-\\u{2d1}\\u{2e0}-\\u{2e4}\\u{2ec}\\u{2ee}\\u{370}-\\u{374}\\u{376}-\\u{377}\\u{37a}-\\u{37d}\\u{37f}\\u{386}\\u{388}-\\u{38a}\\u{38c}\\u{38e}-\\u{3a1}\\u{3a3}-\\u{3f5}\\u{3f7}-\\u{481}\\u{48a}-\\u{52f}\\u{531}-\\u{556}\\u{559}\\u{560}-\\u{588}\\u{5d0}-\\u{5ea}\\u{5ef}-\\u{5f2}\\u{620}-\\u{64a}\\u{660}-\\u{669}\\u{66e}-\\u{66f}\\u{671}-\\u{6d3}\\u{6d5}\\u{6e5}-\\u{6e6}\\u{6ee}-\\u{6fc}\\u{6ff}\\u{710}\\u{712}-\\u{72f}\\u{74d}-\\u{7a5}\\u{7b1}\\u{7c0}-\\u{7ea}\\u{7f4}-\\u{7f5}\\u{7fa}\\u{800}-\\u{815}\\u{81a}\\u{824}\\u{828}\\u{840}-\\u{858}\\u{860}-\\u{86a}\\u{870}-\\u{887}\\u{889}-\\u{88e}\\u{8a0}-\\u{8c9}\\u{904}-\\u{939}\\u{93d}\\u{950}\\u{958}-\\u{961}\\u{966}-\\u{96f}\\u{971}-\\u{980}\\u{985}-\\u{98c}\\u{98f}-\\u{990}\\u{993}-\\u{9a8}\\u{9aa}-\\u{9b0}\\u{9b2}\\u{9b6}-\\u{9b9}\\u{9bd}\\u{9ce}\\u{9dc}-\\u{9dd}\\u{9df}-\\u{9e1}\\u{9e6}-\\u{9f1}\\u{9f4}-\\u{9f9}\\u{9fc}\\u{a05}-\\u{a0a}\\u{a0f}-\\u{a10}\\u{a13}-\\u{a28}\\u{a2a}-\\u{a30}\\u{a32}-\\u{a33}\\u{a35}-\\u{a36}\\u{a38}-\\u{a39}\\u{a59}-\\u{a5c}\\u{a5e}\\u{a66}-\\u{a6f}\\u{a72}-\\u{a74}\\u{a85}-\\u{a8d}\\u{a8f}-\\u{a91}\\u{a93}-\\u{aa8}\\u{aaa}-\\u{ab0}\\u{ab2}-\\u{ab3}\\u{ab5}-\\u{ab9}\\u{abd}\\u{ad0}\\u{ae0}-\\u{ae1}\\u{ae6}-\\u{aef}\\u{af9}\\u{b05}-\\u{b0c}\\u{b0f}-\\u{b10}\\u{b13}-\\u{b28}\\u{b2a}-\\u{b30}\\u{b32}-\\u{b33}\\u{b35}-\\u{b39}\\u{b3d}\\u{b5c}-\\u{b5d}\\u{b5f}-\\u{b61}\\u{b66}-\\u{b6f}\\u{b71}-\\u{b77}\\u{b83}\\u{b85}-\\u{b8a}\\u{b8e}-\\u{b90}\\u{b92}-\\u{b95}\\u{b99}-\\u{b9a}\\u{b9c}\\u{b9e}-\\u{b9f}\\u{ba3}-\\u{ba4}\\u{ba8}-\\u{baa}\\u{bae}-\\u{bb9}\\u{bd0}\\u{be6}-\\u{bf2}\\u{c05}-\\u{c0c}\\u{c0e}-\\u{c10}\\u{c12}-\\u{c28}\\u{c2a}-\\u{c39}\\u{c3d}\\u{c58}-\\u{c5a}\\u{c5d}\\u{c60}-\\u{c61}\\u{c66}-\\u{c6f}\\u{c78}-\\u{c7e}\\u{c80}\\u{c85}-\\u{c8c}\\u{c8e}-\\u{c90}\\u{c92}-\\u{ca8}\\u{caa}-\\u{cb3}\\u{cb5}-\\u{cb9}\\u{cbd}\\u{cdd}-\\u{cde}\\u{ce0}-\\u{ce1}\\u{ce6}-\\u{cef}\\u{cf1}-\\u{cf2}\\u{d04}-\\u{d0c}\\u{d0e}-\\u{d10}\\u{d12}-\\u{d3a}\\u{d3d}\\u{d4e}\\u{d54}-\\u{d56}\\u{d58}-\\u{d61}\\u{d66}-\\u{d78}\\u{d7a}-\\u{d7f}\\u{d85}-\\u{d96}\\u{d9a}-\\u{db1}\\u{db3}-\\u{dbb}\\u{dbd}\\u{dc0}-\\u{dc6}\\u{de6}-\\u{def}\\u{e01}-\\u{e30}\\u{e32}-\\u{e33}\\u{e40}-\\u{e46}\\u{e50}-\\u{e59}\\u{e81}-\\u{e82}\\u{e84}\\u{e86}-\\u{e8a}\\u{e8c}-\\u{ea3}\\u{ea5}\\u{ea7}-\\u{eb0}\\u{eb2}-\\u{eb3}\\u{ebd}\\u{ec0}-\\u{ec4}\\u{ec6}\\u{ed0}-\\u{ed9}\\u{edc}-\\u{edf}\\u{f00}\\u{f20}-\\u{f33}\\u{f40}-\\u{f47}\\u{f49}-\\u{f6c}\\u{f88}-\\u{f8c}\\u{1000}-\\u{102a}\\u{103f}-\\u{1049}\\u{1050}-\\u{1055}\\u{105a}-\\u{105d}\\u{1061}\\u{1065}-\\u{1066}\\u{106e}-\\u{1070}\\u{1075}-\\u{1081}\\u{108e}\\u{1090}-\\u{1099}\\u{10a0}-\\u{10c5}\\u{10c7}\\u{10cd}\\u{10d0}-\\u{10fa}\\u{10fc}-\\u{1248}\\u{124a}-\\u{124d}\\u{1250}-\\u{1256}\\u{1258}\\u{125a}-\\u{125d}\\u{1260}-\\u{1288}\\u{128a}-\\u{128d}\\u{1290}-\\u{12b0}\\u{12b2}-\\u{12b5}\\u{12b8}-\\u{12be}\\u{12c0}\\u{12c2}-\\u{12c5}\\u{12c8}-\\u{12d6}\\u{12d8}-\\u{1310}\\u{1312}-\\u{1315}\\u{1318}-\\u{135a}\\u{1369}-\\u{137c}\\u{1380}-\\u{138f}\\u{13a0}-\\u{13f5}\\u{13f8}-\\u{13fd}\\u{1401}-\\u{166c}\\u{166f}-\\u{167f}\\u{1681}-\\u{169a}\\u{16a0}-\\u{16ea}\\u{16ee}-\\u{16f8}\\u{1700}-\\u{1711}\\u{171f}-\\u{1731}\\u{1740}-\\u{1751}\\u{1760}-\\u{176c}\\u{176e}-\\u{1770}\\u{1780}-\\u{17b3}\\u{17d7}\\u{17dc}\\u{17e0}-\\u{17e9}\\u{17f0}-\\u{17f9}\\u{1810}-\\u{1819}\\u{1820}-\\u{1878}\\u{1880}-\\u{1884}\\u{1887}-\\u{18a8}\\u{18aa}\\u{18b0}-\\u{18f5}\\u{1900}-\\u{191e}\\u{1946}-\\u{196d}\\u{1970}-\\u{1974}\\u{1980}-\\u{19ab}\\u{19b0}-\\u{19c9}\\u{19d0}-\\u{19da}\\u{1a00}-\\u{1a16}\\u{1a20}-\\u{1a54}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1aa7}\\u{1b05}-\\u{1b33}\\u{1b45}-\\u{1b4c}\\u{1b50}-\\u{1b59}\\u{1b83}-\\u{1ba0}\\u{1bae}-\\u{1be5}\\u{1c00}-\\u{1c23}\\u{1c40}-\\u{1c49}\\u{1c4d}-\\u{1c7d}\\u{1c80}-\\u{1c88}\\u{1c90}-\\u{1cba}\\u{1cbd}-\\u{1cbf}\\u{1ce9}-\\u{1cec}\\u{1cee}-\\u{1cf3}\\u{1cf5}-\\u{1cf6}\\u{1cfa}\\u{1d00}-\\u{1dbf}\\u{1e00}-\\u{1f15}\\u{1f18}-\\u{1f1d}\\u{1f20}-\\u{1f45}\\u{1f48}-\\u{1f4d}\\u{1f50}-\\u{1f57}\\u{1f59}\\u{1f5b}\\u{1f5d}\\u{1f5f}-\\u{1f7d}\\u{1f80}-\\u{1fb4}\\u{1fb6}-\\u{1fbc}\\u{1fbe}\\u{1fc2}-\\u{1fc4}\\u{1fc6}-\\u{1fcc}\\u{1fd0}-\\u{1fd3}\\u{1fd6}-\\u{1fdb}\\u{1fe0}-\\u{1fec}\\u{1ff2}-\\u{1ff4}\\u{1ff6}-\\u{1ffc}\\u{2070}-\\u{2071}\\u{2074}-\\u{2079}\\u{207f}-\\u{2089}\\u{2090}-\\u{209c}\\u{2102}\\u{2107}\\u{210a}-\\u{2113}\\u{2115}\\u{2119}-\\u{211d}\\u{2124}\\u{2126}\\u{2128}\\u{212a}-\\u{212d}\\u{212f}-\\u{2139}\\u{213c}-\\u{213f}\\u{2145}-\\u{2149}\\u{214e}\\u{2150}-\\u{2189}\\u{2460}-\\u{249b}\\u{24ea}-\\u{24ff}\\u{2776}-\\u{2793}\\u{2c00}-\\u{2ce4}\\u{2ceb}-\\u{2cee}\\u{2cf2}-\\u{2cf3}\\u{2cfd}\\u{2d00}-\\u{2d25}\\u{2d27}\\u{2d2d}\\u{2d30}-\\u{2d67}\\u{2d6f}\\u{2d80}-\\u{2d96}\\u{2da0}-\\u{2da6}\\u{2da8}-\\u{2dae}\\u{2db0}-\\u{2db6}\\u{2db8}-\\u{2dbe}\\u{2dc0}-\\u{2dc6}\\u{2dc8}-\\u{2dce}\\u{2dd0}-\\u{2dd6}\\u{2dd8}-\\u{2dde}\\u{2e2f}\\u{3005}-\\u{3007}\\u{3021}-\\u{3029}\\u{3031}-\\u{3035}\\u{3038}-\\u{303c}\\u{3041}-\\u{3096}\\u{309d}-\\u{309f}\\u{30a1}-\\u{30fa}\\u{30fc}-\\u{30ff}\\u{3105}-\\u{312f}\\u{3131}-\\u{318e}\\u{3192}-\\u{3195}\\u{31a0}-\\u{31bf}\\u{31f0}-\\u{31ff}\\u{3220}-\\u{3229}\\u{3248}-\\u{324f}\\u{3251}-\\u{325f}\\u{3280}-\\u{3289}\\u{32b1}-\\u{32bf}\\u{3400}-\\u{4dbf}\\u{4e00}-\\u{a48c}\\u{a4d0}-\\u{a4fd}\\u{a500}-\\u{a60c}\\u{a610}-\\u{a62b}\\u{a640}-\\u{a66e}\\u{a67f}-\\u{a69d}\\u{a6a0}-\\u{a6ef}\\u{a717}-\\u{a71f}\\u{a722}-\\u{a788}\\u{a78b}-\\u{a7ca}\\u{a7d0}-\\u{a7d1}\\u{a7d3}\\u{a7d5}-\\u{a7d9}\\u{a7f2}-\\u{a801}\\u{a803}-\\u{a805}\\u{a807}-\\u{a80a}\\u{a80c}-\\u{a822}\\u{a830}-\\u{a835}\\u{a840}-\\u{a873}\\u{a882}-\\u{a8b3}\\u{a8d0}-\\u{a8d9}\\u{a8f2}-\\u{a8f7}\\u{a8fb}\\u{a8fd}-\\u{a8fe}\\u{a900}-\\u{a925}\\u{a930}-\\u{a946}\\u{a960}-\\u{a97c}\\u{a984}-\\u{a9b2}\\u{a9cf}-\\u{a9d9}\\u{a9e0}-\\u{a9e4}\\u{a9e6}-\\u{a9fe}\\u{aa00}-\\u{aa28}\\u{aa40}-\\u{aa42}\\u{aa44}-\\u{aa4b}\\u{aa50}-\\u{aa59}\\u{aa60}-\\u{aa76}\\u{aa7a}\\u{aa7e}-\\u{aaaf}\\u{aab1}\\u{aab5}-\\u{aab6}\\u{aab9}-\\u{aabd}\\u{aac0}\\u{aac2}\\u{aadb}-\\u{aadd}\\u{aae0}-\\u{aaea}\\u{aaf2}-\\u{aaf4}\\u{ab01}-\\u{ab06}\\u{ab09}-\\u{ab0e}\\u{ab11}-\\u{ab16}\\u{ab20}-\\u{ab26}\\u{ab28}-\\u{ab2e}\\u{ab30}-\\u{ab5a}\\u{ab5c}-\\u{ab69}\\u{ab70}-\\u{abe2}\\u{abf0}-\\u{abf9}\\u{ac00}-\\u{d7a3}\\u{d7b0}-\\u{d7c6}\\u{d7cb}-\\u{d7fb}\\u{f900}-\\u{fa6d}\\u{fa70}-\\u{fad9}\\u{fb00}-\\u{fb06}\\u{fb13}-\\u{fb17}\\u{fb1d}\\u{fb1f}-\\u{fb28}\\u{fb2a}-\\u{fb36}\\u{fb38}-\\u{fb3c}\\u{fb3e}\\u{fb40}-\\u{fb41}\\u{fb43}-\\u{fb44}\\u{fb46}-\\u{fbb1}\\u{fbd3}-\\u{fd3d}\\u{fd50}-\\u{fd8f}\\u{fd92}-\\u{fdc7}\\u{fdf0}-\\u{fdfb}\\u{fe70}-\\u{fe74}\\u{fe76}-\\u{fefc}\\u{ff10}-\\u{ff19}\\u{ff21}-\\u{ff3a}\\u{ff41}-\\u{ff5a}\\u{ff66}-\\u{ffbe}\\u{ffc2}-\\u{ffc7}\\u{ffca}-\\u{ffcf}\\u{ffd2}-\\u{ffd7}\\u{ffda}-\\u{ffdc}\\u{10000}-\\u{1000b}\\u{1000d}-\\u{10026}\\u{10028}-\\u{1003a}\\u{1003c}-\\u{1003d}\\u{1003f}-\\u{1004d}\\u{10050}-\\u{1005d}\\u{10080}-\\u{100fa}\\u{10107}-\\u{10133}\\u{10140}-\\u{10178}\\u{1018a}-\\u{1018b}\\u{10280}-\\u{1029c}\\u{102a0}-\\u{102d0}\\u{102e1}-\\u{102fb}\\u{10300}-\\u{10323}\\u{1032d}-\\u{1034a}\\u{10350}-\\u{10375}\\u{10380}-\\u{1039d}\\u{103a0}-\\u{103c3}\\u{103c8}-\\u{103cf}\\u{103d1}-\\u{103d5}\\u{10400}-\\u{1049d}\\u{104a0}-\\u{104a9}\\u{104b0}-\\u{104d3}\\u{104d8}-\\u{104fb}\\u{10500}-\\u{10527}\\u{10530}-\\u{10563}\\u{10570}-\\u{1057a}\\u{1057c}-\\u{1058a}\\u{1058c}-\\u{10592}\\u{10594}-\\u{10595}\\u{10597}-\\u{105a1}\\u{105a3}-\\u{105b1}\\u{105b3}-\\u{105b9}\\u{105bb}-\\u{105bc}\\u{10600}-\\u{10736}\\u{10740}-\\u{10755}\\u{10760}-\\u{10767}\\u{10780}-\\u{10785}\\u{10787}-\\u{107b0}\\u{107b2}-\\u{107ba}\\u{10800}-\\u{10805}\\u{10808}\\u{1080a}-\\u{10835}\\u{10837}-\\u{10838}\\u{1083c}\\u{1083f}-\\u{10855}\\u{10858}-\\u{10876}\\u{10879}-\\u{1089e}\\u{108a7}-\\u{108af}\\u{108e0}-\\u{108f2}\\u{108f4}-\\u{108f5}\\u{108fb}-\\u{1091b}\\u{10920}-\\u{10939}\\u{10980}-\\u{109b7}\\u{109bc}-\\u{109cf}\\u{109d2}-\\u{10a00}\\u{10a10}-\\u{10a13}\\u{10a15}-\\u{10a17}\\u{10a19}-\\u{10a35}\\u{10a40}-\\u{10a48}\\u{10a60}-\\u{10a7e}\\u{10a80}-\\u{10a9f}\\u{10ac0}-\\u{10ac7}\\u{10ac9}-\\u{10ae4}\\u{10aeb}-\\u{10aef}\\u{10b00}-\\u{10b35}\\u{10b40}-\\u{10b55}\\u{10b58}-\\u{10b72}\\u{10b78}-\\u{10b91}\\u{10ba9}-\\u{10baf}\\u{10c00}-\\u{10c48}\\u{10c80}-\\u{10cb2}\\u{10cc0}-\\u{10cf2}\\u{10cfa}-\\u{10d23}\\u{10d30}-\\u{10d39}\\u{10e60}-\\u{10e7e}\\u{10e80}-\\u{10ea9}\\u{10eb0}-\\u{10eb1}\\u{10f00}-\\u{10f27}\\u{10f30}-\\u{10f45}\\u{10f51}-\\u{10f54}\\u{10f70}-\\u{10f81}\\u{10fb0}-\\u{10fcb}\\u{10fe0}-\\u{10ff6}\\u{11003}-\\u{11037}\\u{11052}-\\u{1106f}\\u{11071}-\\u{11072}\\u{11075}\\u{11083}-\\u{110af}\\u{110d0}-\\u{110e8}\\u{110f0}-\\u{110f9}\\u{11103}-\\u{11126}\\u{11136}-\\u{1113f}\\u{11144}\\u{11147}\\u{11150}-\\u{11172}\\u{11176}\\u{11183}-\\u{111b2}\\u{111c1}-\\u{111c4}\\u{111d0}-\\u{111da}\\u{111dc}\\u{111e1}-\\u{111f4}\\u{11200}-\\u{11211}\\u{11213}-\\u{1122b}\\u{1123f}-\\u{11240}\\u{11280}-\\u{11286}\\u{11288}\\u{1128a}-\\u{1128d}\\u{1128f}-\\u{1129d}\\u{1129f}-\\u{112a8}\\u{112b0}-\\u{112de}\\u{112f0}-\\u{112f9}\\u{11305}-\\u{1130c}\\u{1130f}-\\u{11310}\\u{11313}-\\u{11328}\\u{1132a}-\\u{11330}\\u{11332}-\\u{11333}\\u{11335}-\\u{11339}\\u{1133d}\\u{11350}\\u{1135d}-\\u{11361}\\u{11400}-\\u{11434}\\u{11447}-\\u{1144a}\\u{11450}-\\u{11459}\\u{1145f}-\\u{11461}\\u{11480}-\\u{114af}\\u{114c4}-\\u{114c5}\\u{114c7}\\u{114d0}-\\u{114d9}\\u{11580}-\\u{115ae}\\u{115d8}-\\u{115db}\\u{11600}-\\u{1162f}\\u{11644}\\u{11650}-\\u{11659}\\u{11680}-\\u{116aa}\\u{116b8}\\u{116c0}-\\u{116c9}\\u{11700}-\\u{1171a}\\u{11730}-\\u{1173b}\\u{11740}-\\u{11746}\\u{11800}-\\u{1182b}\\u{118a0}-\\u{118f2}\\u{118ff}-\\u{11906}\\u{11909}\\u{1190c}-\\u{11913}\\u{11915}-\\u{11916}\\u{11918}-\\u{1192f}\\u{1193f}\\u{11941}\\u{11950}-\\u{11959}\\u{119a0}-\\u{119a7}\\u{119aa}-\\u{119d0}\\u{119e1}\\u{119e3}\\u{11a00}\\u{11a0b}-\\u{11a32}\\u{11a3a}\\u{11a50}\\u{11a5c}-\\u{11a89}\\u{11a9d}\\u{11ab0}-\\u{11af8}\\u{11c00}-\\u{11c08}\\u{11c0a}-\\u{11c2e}\\u{11c40}\\u{11c50}-\\u{11c6c}\\u{11c72}-\\u{11c8f}\\u{11d00}-\\u{11d06}\\u{11d08}-\\u{11d09}\\u{11d0b}-\\u{11d30}\\u{11d46}\\u{11d50}-\\u{11d59}\\u{11d60}-\\u{11d65}\\u{11d67}-\\u{11d68}\\u{11d6a}-\\u{11d89}\\u{11d98}\\u{11da0}-\\u{11da9}\\u{11ee0}-\\u{11ef2}\\u{11f02}\\u{11f04}-\\u{11f10}\\u{11f12}-\\u{11f33}\\u{11f50}-\\u{11f59}\\u{11fb0}\\u{11fc0}-\\u{11fd4}\\u{12000}-\\u{12399}\\u{12400}-\\u{1246e}\\u{12480}-\\u{12543}\\u{12f90}-\\u{12ff0}\\u{13000}-\\u{1342f}\\u{13441}-\\u{13446}\\u{14400}-\\u{14646}\\u{16800}-\\u{16a38}\\u{16a40}-\\u{16a5e}\\u{16a60}-\\u{16a69}\\u{16a70}-\\u{16abe}\\u{16ac0}-\\u{16ac9}\\u{16ad0}-\\u{16aed}\\u{16b00}-\\u{16b2f}\\u{16b40}-\\u{16b43}\\u{16b50}-\\u{16b59}\\u{16b5b}-\\u{16b61}\\u{16b63}-\\u{16b77}\\u{16b7d}-\\u{16b8f}\\u{16e40}-\\u{16e96}\\u{16f00}-\\u{16f4a}\\u{16f50}\\u{16f93}-\\u{16f9f}\\u{16fe0}-\\u{16fe1}\\u{16fe3}\\u{17000}-\\u{187f7}\\u{18800}-\\u{18cd5}\\u{18d00}-\\u{18d08}\\u{1aff0}-\\u{1aff3}\\u{1aff5}-\\u{1affb}\\u{1affd}-\\u{1affe}\\u{1b000}-\\u{1b122}\\u{1b132}\\u{1b150}-\\u{1b152}\\u{1b155}\\u{1b164}-\\u{1b167}\\u{1b170}-\\u{1b2fb}\\u{1bc00}-\\u{1bc6a}\\u{1bc70}-\\u{1bc7c}\\u{1bc80}-\\u{1bc88}\\u{1bc90}-\\u{1bc99}\\u{1d2c0}-\\u{1d2d3}\\u{1d2e0}-\\u{1d2f3}\\u{1d360}-\\u{1d378}\\u{1d400}-\\u{1d454}\\u{1d456}-\\u{1d49c}\\u{1d49e}-\\u{1d49f}\\u{1d4a2}\\u{1d4a5}-\\u{1d4a6}\\u{1d4a9}-\\u{1d4ac}\\u{1d4ae}-\\u{1d4b9}\\u{1d4bb}\\u{1d4bd}-\\u{1d4c3}\\u{1d4c5}-\\u{1d505}\\u{1d507}-\\u{1d50a}\\u{1d50d}-\\u{1d514}\\u{1d516}-\\u{1d51c}\\u{1d51e}-\\u{1d539}\\u{1d53b}-\\u{1d53e}\\u{1d540}-\\u{1d544}\\u{1d546}\\u{1d54a}-\\u{1d550}\\u{1d552}-\\u{1d6a5}\\u{1d6a8}-\\u{1d6c0}\\u{1d6c2}-\\u{1d6da}\\u{1d6dc}-\\u{1d6fa}\\u{1d6fc}-\\u{1d714}\\u{1d716}-\\u{1d734}\\u{1d736}-\\u{1d74e}\\u{1d750}-\\u{1d76e}\\u{1d770}-\\u{1d788}\\u{1d78a}-\\u{1d7a8}\\u{1d7aa}-\\u{1d7c2}\\u{1d7c4}-\\u{1d7cb}\\u{1d7ce}-\\u{1d7ff}\\u{1df00}-\\u{1df1e}\\u{1df25}-\\u{1df2a}\\u{1e030}-\\u{1e06d}\\u{1e100}-\\u{1e12c}\\u{1e137}-\\u{1e13d}\\u{1e140}-\\u{1e149}\\u{1e14e}\\u{1e290}-\\u{1e2ad}\\u{1e2c0}-\\u{1e2eb}\\u{1e2f0}-\\u{1e2f9}\\u{1e4d0}-\\u{1e4eb}\\u{1e4f0}-\\u{1e4f9}\\u{1e7e0}-\\u{1e7e6}\\u{1e7e8}-\\u{1e7eb}\\u{1e7ed}-\\u{1e7ee}\\u{1e7f0}-\\u{1e7fe}\\u{1e800}-\\u{1e8c4}\\u{1e8c7}-\\u{1e8cf}\\u{1e900}-\\u{1e943}\\u{1e94b}\\u{1e950}-\\u{1e959}\\u{1ec71}-\\u{1ecab}\\u{1ecad}-\\u{1ecaf}\\u{1ecb1}-\\u{1ecb4}\\u{1ed01}-\\u{1ed2d}\\u{1ed2f}-\\u{1ed3d}\\u{1ee00}-\\u{1ee03}\\u{1ee05}-\\u{1ee1f}\\u{1ee21}-\\u{1ee22}\\u{1ee24}\\u{1ee27}\\u{1ee29}-\\u{1ee32}\\u{1ee34}-\\u{1ee37}\\u{1ee39}\\u{1ee3b}\\u{1ee42}\\u{1ee47}\\u{1ee49}\\u{1ee4b}\\u{1ee4d}-\\u{1ee4f}\\u{1ee51}-\\u{1ee52}\\u{1ee54}\\u{1ee57}\\u{1ee59}\\u{1ee5b}\\u{1ee5d}\\u{1ee5f}\\u{1ee61}-\\u{1ee62}\\u{1ee64}\\u{1ee67}-\\u{1ee6a}\\u{1ee6c}-\\u{1ee72}\\u{1ee74}-\\u{1ee77}\\u{1ee79}-\\u{1ee7c}\\u{1ee7e}\\u{1ee80}-\\u{1ee89}\\u{1ee8b}-\\u{1ee9b}\\u{1eea1}-\\u{1eea3}\\u{1eea5}-\\u{1eea9}\\u{1eeab}-\\u{1eebb}\\u{1f100}-\\u{1f10c}\\u{1fbf0}-\\u{1fbf9}\\u{20000}-\\u{2a6df}\\u{2a700}-\\u{2b739}\\u{2b740}-\\u{2b81d}\\u{2b820}-\\u{2cea1}\\u{2ceb0}-\\u{2ebe0}\\u{2ebf0}-\\u{2ee5d}\\u{2f800}-\\u{2fa1d}\\u{30000}-\\u{3134a}\\u{31350}-\\u{323af} ,._:'–-]+(?=\\n?$)", "u");
const pattern85 = new RegExp("^[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]*\\.?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+(?=\\n?$)", "u");
const pattern88 = new RegExp("^[-+]?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{1,2}(?:\\.[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+)?,[-+]?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{1,3}(?:\\.[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+)?(?=\\n?$)", "u");
const schema42 = {"additionalProperties":true,"properties":{"bed_net_usage":{"minimum":0,"type":["number","null"]},"geo_admin1":{"type":["string","null"]},"geo_admin2":{"type":["string","null"]},"geo_admin3":{"type":["string","null"]},"lat_lon":{"pattern":"^[-+]?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{1,2}(?:\\.[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+)?,[-+]?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{1,3}(?:\\.[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+)?(?=\\n?$)","type":["string","null"]},"travel_country":{"pattern":"^[\\u{30}-\\u{39}\\u{41}-\\u{5a}\\u{5f}\\u{61}-\\u{7a}\\u{aa}\\u{b2}-\\u{b3}\\u{b5}\\u{b9}-\\u{ba}\\u{bc}-\\u{be}\\u{c0}-\\u{d6}\\u{d8}-\\u{f6}\\u{f8}-\\u{2c1}\\u{2c6}-\\u{2d1}\\u{2e0}-\\u{2e4}\\u{2ec}\\u{2ee}\\u{370}-\\u{374}\\u{376}-\\u{377}\\u{37a}-\\u{37d}\\u{37f}\\u{386}\\u{388}-\\u{38a}\\u{38c}\\u{38e}-\\u{3a1}\\u{3a3}-\\u{3f5}\\u{3f7}-\\u{481}\\u{48a}-\\u{52f}\\u{531}-\\u{556}\\u{559}\\u{560}-\\u{588}\\u{5d0}-\\u{5ea}\\u{5ef}-\\u{5f2}\\u{620}-\\u{64a}\\u{660}-\\u{669}\\u{66e}-\\u{66f}\\u{671}-\\u{6d3}\\u{6d5}\\u{6e5}-\\u{6e6}\\u{6ee}-\\u{6fc}\\u{6ff}\\u{710}\\u{712}-\\u{72f}\\u{74d}-\\u{7a5}\\u{7b1}\\u{7c0}-\\u{7ea}\\u{7f4}-\\u{7f5}\\u{7fa}\\u{800}-\\u{815}\\u{81a}\\u{824}\\u{828}\\u{840}-\\u{858}\\u{860}-\\u{86a}\\u{870}-\\u{887}\\u{889}-\\u{88e}\\u{8a0}-\\u{8c9}\\u{904}-\\u{939}\\u{93d}\\u{950}\\u{958}-\\u{961}\\u{966}-\\u{96f}\\u{971}-\\u{980}\\u{985}-\\u{98c}\\u{98f}-\\u{990}\\u{993}-\\u{9a8}\\u{9aa}-\\u{9b0}\\u{9b2}\\u{9b6}-\\u{9b9}\\u{9bd}\\u{9ce}\\u{9dc}-\\u{9dd}\\u{9df}-\\u{9e1}\\u{9e6}-\\u{9f1}\\u{9f4}-\\u{9f9}\\u{9fc}\\u{a05}-\\u{a0a}\\u{a0f}-\\u{a10}\\u{a13}-\\u{a28}\\u{a2a}-\\u{a30}\\u{a32}-\\u{a33}\\u{a35}-\\u{a36}\\u{a38}-\\u{a39}\\u{a59}-\\u{a5c}\\u{a5e}\\u{a66}-\\u{a6f}\\u{a72}-\\u{a74}\\u{a85}-\\u{a8d}\\u{a8f}-\\u{a91}\\u{a93}-\\u{aa8}\\u{aaa}-\\u{ab0}\\u{ab2}-\\u{ab3}\\u{ab5}-\\u{ab9}\\u{abd}\\u{ad0}\\u{ae0}-\\u{ae1}\\u{ae6}-\\u{aef}\\u{af9}\\u{b05}-\\u{b0c}\\u{b0f}-\\u{b10}\\u{b13}-\\u{b28}\\u{b2a}-\\u{b30}\\u{b32}-\\u{b33}\\u{b35}-\\u{b39}\\u{b3d}\\u{b5c}-\\u{b5d}\\u{b5f}-\\u{b61}\\u{b66}-\\u{b6f}\\u{b71}-\\u{b77}\\u{b83}\\u{b85}-\\u{b8a}\\u{b8e}-\\u{b90}\\u{b92}-\\u{b95}\\u{b99}-\\u{b9a}\\u{b9c}\\u{b9e}-\\u{b9f}\\u{ba3}-\\u{ba4}\\u{ba8}-\\u{baa}\\u{bae}-\\u{bb9}\\u{bd0}\\u{be6}-\\u{bf2}\\u{c05}-\\u{c0c}\\u{c0e}-\\u{c10}\\u{c12}-\\u{c28}\\u{c2a}-\\u{c39}\\u{c3d}\\u{c58}-\\u{c5a}\\u{c5d}\\u{c60}-\\u{c61}\\u{c66}-\\u{c6f}\\u{c78}-\\u{c7e}\\u{c80}\\u{c85}-\\u{c8c}\\u{c8e}-\\u{c90}\\u{c92}-\\u{ca8}\\u{caa}-\\u{cb3}\\u{cb5}-\\u{cb9}\\u{cbd}\\u{cdd}-\\u{cde}\\u{ce0}-\\u{ce1}\\u{ce6}-\\u{cef}\\u{cf1}-\\u{cf2}\\u{d04}-\\u{d0c}\\u{d0e}-\\u{d10}\\u{d12}-\\u{d3a}\\u{d3d}\\u{d4e}\\u{d54}-\\u{d56}\\u{d58}-\\u{d61}\\u{d66}-\\u{d78}\\u{d7a}-\\u{d7f}\\u{d85}-\\u{d96}\\u{d9a}-\\u{db1}\\u{db3}-\\u{dbb}\\u{dbd}\\u{dc0}-\\u{dc6}\\u{de6}-\\u{def}\\u{e01}-\\u{e30}\\u{e32}-\\u{e33}\\u{e40}-\\u{e46}\\u{e50}-\\u{e59}\\u{e81}-\\u{e82}\\u{e84}\\u{e86}-\\u{e8a}\\u{e8c}-\\u{ea3}\\u{ea5}\\u{ea7}-\\u{eb0}\\u{eb2}-\\u{eb3}\\u{ebd}\\u{ec0}-\\u{ec4}\\u{ec6}\\u{ed0}-\\u{ed9}\\u{edc}-\\u{edf}\\u{f00}\\u{f20}-\\u{f33}\\u{f40}-\\u{f47}\\u{f49}-\\u{f6c}\\u{f88}-\\u{f8c}\\u{1000}-\\u{102a}\\u{103f}-\\u{1049}\\u{1050}-\\u{1055}\\u{105a}-\\u{105d}\\u{1061}\\u{1065}-\\u{1066}\\u{106e}-\\u{1070}\\u{1075}-\\u{1081}\\u{108e}\\u{1090}-\\u{1099}\\u{10a0}-\\u{10c5}\\u{10c7}\\u{10cd}\\u{10d0}-\\u{10fa}\\u{10fc}-\\u{1248}\\u{124a}-\\u{124d}\\u{1250}-\\u{1256}\\u{1258}\\u{125a}-\\u{125d}\\u{1260}-\\u{1288}\\u{128a}-\\u{128d}\\u{1290}-\\u{12b0}\\u{12b2}-\\u{12b5}\\u{12b8}-\\u{12be}\\u{12c0}\\u{12c2}-\\u{12c5}\\u{12c8}-\\u{12d6}\\u{12d8}-\\u{1310}\\u{1312}-\\u{1315}\\u{1318}-\\u{135a}\\u{1369}-\\u{137c}\\u{1380}-\\u{138f}\\u{13a0}-\\u{13f5}\\u{13f8}-\\u{13fd}\\u{1401}-\\u{166c}\\u{166f}-\\u{167f}\\u{1681}-\\u{169a}\\u{16a0}-\\u{16ea}\\u{16ee}-\\u{16f8}\\u{1700}-\\u{1711}\\u{171f}-\\u{1731}\\u{1740}-\\u{1751}\\u{1760}-\\u{176c}\\u{176e}-\\u{1770}\\u{1780}-\\u{17b3}\\u{17d7}\\u{17dc}\\u{17e0}-\\u{17e9}\\u{17f0}-\\u{17f9}\\u{1810}-\\u{1819}\\u{1820}-\\u{1878}\\u{1880}-\\u{1884}\\u{1887}-\\u{18a8}\\u{18aa}\\u{18b0}-\\u{18f5}\\u{1900}-\\u{191e}\\u{1946}-\\u{196d}\\u{1970}-\\u{1974}\\u{1980}-\\u{19ab}\\u{19b0}-\\u{19c9}\\u{19d0}-\\u{19da}\\u{1a00}-\\u{1a16}\\u{1a20}-\\u{1a54}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1aa7}\\u{1b05}-\\u{1b33}\\u{1b45}-\\u{1b4c}\\u{1b50}-\\u{1b59}\\u{1b83}-\\u{1ba0}\\u{1bae}-\\u{1be5}\\u{1c00}-\\u{1c23}\\u{1c40}-\\u{1c49}\\u{1c4d}-\\u{1c7d}\\u{1c80}-\\u{1c88}\\u{1c90}-\\u{1cba}\\u{1cbd}-\\u{1cbf}\\u{1ce9}-\\u{1cec}\\u{1cee}-\\u{1cf3}\\u{1cf5}-\\u{1cf6}\\u{1cfa}\\u{1d00}-\\u{1dbf}\\u{1e00}-\\u{1f15}\\u{1f18}-\\u{1f1d}\\u{1f20}-\\u{1f45}\\u{1f48}-\\u{1f4d}\\u{1f50}-\\u{1f57}\\u{1f59}\\u{1f5b}\\u{1f5d}\\u{1f5f}-\\u{1f7d}\\u{1f80}-\\u{1fb4}\\u{1fb6}-\\u{1fbc}\\u{1fbe}\\u{1fc2}-\\u{1fc4}\\u{1fc6}-\\u{1fcc}\\u{1fd0}-\\u{1fd3}\\u{1fd6}-\\u{1fdb}\\u{1fe0}-\\u{1fec}\\u{1ff2}-\\u{1ff4}\\u{1ff6}-\\u{1ffc}\\u{2070}-\\u{2071}\\u{2074}-\\u{2079}\\u{207f}-\\u{2089}\\u{2090}-\\u{209c}\\u{2102}\\u{2107}\\u{210a}-\\u{2113}\\u{2115}\\u{2119}-\\u{211d}\\u{2124}\\u{2126}\\u{2128}\\u{212a}-\\u{212d}\\u{212f}-\\u{2139}\\u{213c}-\\u{213f}\\u{2145}-\\u{2149}\\u{214e}\\u{2150}-\\u{2189}\\u{2460}-\\u{249b}\\u{24ea}-\\u{24ff}\\u{2776}-\\u{2793}\\u{2c00}-\\u{2ce4}\\u{2ceb}-\\u{2cee}\\u{2cf2}-\\u{2cf3}\\u{2cfd}\\u{2d00}-\\u{2d25}\\u{2d27}\\u{2d2d}\\u{2d30}-\\u{2d67}\\u{2d6f}\\u{2d80}-\\u{2d96}\\u{2da0}-\\u{2da6}\\u{2da8}-\\u{2dae}\\u{2db0}-\\u{2db6}\\u{2db8}-\\u{2dbe}\\u{2dc0}-\\u{2dc6}\\u{2dc8}-\\u{2dce}\\u{2dd0}-\\u{2dd6}\\u{2dd8}-\\u{2dde}\\u{2e2f}\\u{3005}-\\u{3007}\\u{3021}-\\u{3029}\\u{3031}-\\u{3035}\\u{3038}-\\u{303c}\\u{3041}-\\u{3096}\\u{309d}-\\u{309f}\\u{30a1}-\\u{30fa}\\u{30fc}-\\u{30ff}\\u{3105}-\\u{312f}\\u{3131}-\\u{318e}\\u{3192}-\\u{3195}\\u{31a0}-\\u{31bf}\\u{31f0}-\\u{31ff}\\u{3220}-\\u{3229}\\u{3248}-\\u{324f}\\u{3251}-\\u{325f}\\u{3280}-\\u{3289}\\u{32b1}-\\u{32bf}\\u{3400}-\\u{4dbf}\\u{4e00}-\\u{a48c}\\u{a4d0}-\\u{a4fd}\\u{a500}-\\u{a60c}\\u{a610}-\\u{a62b}\\u{a640}-\\u{a66e}\\u{a67f}-\\u{a69d}\\u{a6a0}-\\u{a6ef}\\u{a717}-\\u{a71f}\\u{a722}-\\u{a788}\\u{a78b}-\\u{a7ca}\\u{a7d0}-\\u{a7d1}\\u{a7d3}\\u{a7d5}-\\u{a7d9}\\u{a7f2}-\\u{a801}\\u{a803}-\\u{a805}\\u{a807}-\\u{a80a}\\u{a80c}-\\u{a822}\\u{a830}-\\u{a835}\\u{a840}-\\u{a873}\\u{a882}-\\u{a8b3}\\u{a8d0}-\\u{a8d9}\\u{a8f2}-\\u{a8f7}\\u{a8fb}\\u{a8fd}-\\u{a8fe}\\u{a900}-\\u{a925}\\u{a930}-\\u{a946}\\u{a960}-\\u{a97c}\\u{a984}-\\u{a9b2}\\u{a9cf}-\\u{a9d9}\\u{a9e0}-\\u{a9e4}\\u{a9e6}-\\u{a9fe}\\u{aa00}-\\u{aa28}\\u{aa40}-\\u{aa42}\\u{aa44}-\\u{aa4b}\\u{aa50}-\\u{aa59}\\u{aa60}-\\u{aa76}\\u{aa7a}\\u{aa7e}-\\u{aaaf}\\u{aab1}\\u{aab5}-\\u{aab6}\\u{aab9}-\\u{aabd}\\u{aac0}\\u{aac2}\\u{aadb}-\\u{aadd}\\u{aae0}-\\u{aaea}\\u{aaf2}-\\u{aaf4}\\u{ab01}-\\u{ab06}\\u{ab09}-\\u{ab0e}\\u{ab11}-\\u{ab16}\\u{ab20}-\\u{ab26}\\u{ab28}-\\u{ab2e}\\u{ab30}-\\u{ab5a}\\u{ab5c}-\\u{ab69}\\u{ab70}-\\u{abe2}\\u{abf0}-\\u{abf9}\\u{ac00}-\\u{d7a3}\\u{d7b0}-\\u{d7c6}\\u{d7cb}-\\u{d7fb}\\u{f900}-\\u{fa6d}\\u{fa70}-\\u{fad9}\\u{fb00}-\\u{fb06}\\u{fb13}-\\u{fb17}\\u{fb1d}\\u{fb1f}-\\u{fb28}\\u{fb2a}-\\u{fb36}\\u{fb38}-\\u{fb3c}\\u{fb3e}\\u{fb40}-\\u{fb41}\\u{fb43}-\\u{fb44}\\u{fb46}-\\u{fbb1}\\u{fbd3}-\\u{fd3d}\\u{fd50}-\\u{fd8f}\\u{fd92}-\\u{fdc7}\\u{fdf0}-\\u{fdfb}\\u{fe70}-\\u{fe74}\\u{fe76}-\\u{fefc}\\u{ff10}-\\u{ff19}\\u{ff21}-\\u{ff3a}\\u{ff41}-\\u{ff5a}\\u{ff66}-\\u{ffbe}\\u{ffc2}-\\u{ffc7}\\u{ffca}-\\u{ffcf}\\u{ffd2}-\\u{ffd7}\\u{ffda}-\\u{ffdc}\\u{10000}-\\u{1000b}\\u{1000d}-\\u{10026}\\u{10028}-\\u{1003a}\\u{1003c}-\\u{1003d}\\u{1003f}-\\u{1004d}\\u{10050}-\\u{1005d}\\u{10080}-\\u{100fa}\\u{10107}-\\u{10133}\\u{10140}-\\u{10178}\\u{1018a}-\\u{1018b}\\u{10280}-\\u{1029c}\\u{102a0}-\\u{102d0}\\u{102e1}-\\u{102fb}\\u{10300}-\\u{10323}\\u{1032d}-\\u{1034a}\\u{10350}-\\u{10375}\\u{10380}-\\u{1039d}\\u{103a0}-\\u{103c3}\\u{103c8}-\\u{103cf}\\u{103d1}-\\u{103d5}\\u{10400}-\\u{1049d}\\u{104a0}-\\u{104a9}\\u{104b0}-\\u{104d3}\\u{104d8}-\\u{104fb}\\u{10500}-\\u{10527}\\u{10530}-\\u{10563}\\u{10570}-\\u{1057a}\\u{1057c}-\\u{1058a}\\u{1058c}-\\u{10592}\\u{10594}-\\u{10595}\\u{10597}-\\u{105a1}\\u{105a3}-\\u{105b1}\\u{105b3}-\\u{105b9}\\u{105bb}-\\u{105bc}\\u{10600}-\\u{10736}\\u{10740}-\\u{10755}\\u{10760}-\\u{10767}\\u{10780}-\\u{10785}\\u{10787}-\\u{107b0}\\u{107b2}-\\u{107ba}\\u{10800}-\\u{10805}\\u{10808}\\u{1080a}-\\u{10835}\\u{10837}-\\u{10838}\\u{1083c}\\u{1083f}-\\u{10855}\\u{10858}-\\u{10876}\\u{10879}-\\u{1089e}\\u{108a7}-\\u{108af}\\u{108e0}-\\u{108f2}\\u{108f4}-\\u{108f5}\\u{108fb}-\\u{1091b}\\u{10920}-\\u{10939}\\u{10980}-\\u{109b7}\\u{109bc}-\\u{109cf}\\u{109d2}-\\u{10a00}\\u{10a10}-\\u{10a13}\\u{10a15}-\\u{10a17}\\u{10a19}-\\u{10a35}\\u{10a40}-\\u{10a48}\\u{10a60}-\\u{10a7e}\\u{10a80}-\\u{10a9f}\\u{10ac0}-\\u{10ac7}\\u{10ac9}-\\u{10ae4}\\u{10aeb}-\\u{10aef}\\u{10b00}-\\u{10b35}\\u{10b40}-\\u{10b55}\\u{10b58}-\\u{10b72}\\u{10b78}-\\u{10b91}\\u{10ba9}-\\u{10baf}\\u{10c00}-\\u{10c48}\\u{10c80}-\\u{10cb2}\\u{10cc0}-\\u{10cf2}\\u{10cfa}-\\u{10d23}\\u{10d30}-\\u{10d39}\\u{10e60}-\\u{10e7e}\\u{10e80}-\\u{10ea9}\\u{10eb0}-\\u{10eb1}\\u{10f00}-\\u{10f27}\\u{10f30}-\\u{10f45}\\u{10f51}-\\u{10f54}\\u{10f70}-\\u{10f81}\\u{10fb0}-\\u{10fcb}\\u{10fe0}-\\u{10ff6}\\u{11003}-\\u{11037}\\u{11052}-\\u{1106f}\\u{11071}-\\u{11072}\\u{11075}\\u{11083}-\\u{110af}\\u{110d0}-\\u{110e8}\\u{110f0}-\\u{110f9}\\u{11103}-\\u{11126}\\u{11136}-\\u{1113f}\\u{11144}\\u{11147}\\u{11150}-\\u{11172}\\u{11176}\\u{11183}-\\u{111b2}\\u{111c1}-\\u{111c4}\\u{111d0}-\\u{111da}\\u{111dc}\\u{111e1}-\\u{111f4}\\u{11200}-\\u{11211}\\u{11213}-\\u{1122b}\\u{1123f}-\\u{11240}\\u{11280}-\\u{11286}\\u{11288}\\u{1128a}-\\u{1128d}\\u{1128f}-\\u{1129d}\\u{1129f}-\\u{112a8}\\u{112b0}-\\u{112de}\\u{112f0}-\\u{112f9}\\u{11305}-\\u{1130c}\\u{1130f}-\\u{11310}\\u{11313}-\\u{11328}\\u{1132a}-\\u{11330}\\u{11332}-\\u{11333}\\u{11335}-\\u{11339}\\u{1133d}\\u{11350}\\u{1135d}-\\u{11361}\\u{11400}-\\u{11434}\\u{11447}-\\u{1144a}\\u{11450}-\\u{11459}\\u{1145f}-\\u{11461}\\u{11480}-\\u{114af}\\u{114c4}-\\u{114c5}\\u{114c7}\\u{114d0}-\\u{114d9}\\u{11580}-\\u{115ae}\\u{115d8}-\\u{115db}\\u{11600}-\\u{1162f}\\u{11644}\\u{11650}-\\u{11659}\\u{11680}-\\u{116aa}\\u{116b8}\\u{116c0}-\\u{116c9}\\u{11700}-\\u{1171a}\\u{11730}-\\u{1173b}\\u{11740}-\\u{11746}\\u{11800}-\\u{1182b}\\u{118a0}-\\u{118f2}\\u{118ff}-\\u{11906}\\u{11909}\\u{1190c}-\\u{11913}\\u{11915}-\\u{11916}\\u{11918}-\\u{1192f}\\u{1193f}\\u{11941}\\u{11950}-\\u{11959}\\u{119a0}-\\u{119a7}\\u{119aa}-\\u{119d0}\\u{119e1}\\u{119e3}\\u{11a00}\\u{11a0b}-\\u{11a32}\\u{11a3a}\\u{11a50}\\u{11a5c}-\\u{11a89}\\u{11a9d}\\u{11ab0}-\\u{11af8}\\u{11c00}-\\u{11c08}\\u{11c0a}-\\u{11c2e}\\u{11c40}\\u{11c50}-\\u{11c6c}\\u{11c72}-\\u{11c8f}\\u{11d00}-\\u{11d06}\\u{11d08}-\\u{11d09}\\u{11d0b}-\\u{11d30}\\u{11d46}\\u{11d50}-\\u{11d59}\\u{11d60}-\\u{11d65}\\u{11d67}-\\u{11d68}\\u{11d6a}-\\u{11d89}\\u{11d98}\\u{11da0}-\\u{11da9}\\u{11ee0}-\\u{11ef2}\\u{11f02}\\u{11f04}-\\u{11f10}\\u{11f12}-\\u{11f33}\\u{11f50}-\\u{11f59}\\u{11fb0}\\u{11fc0}-\\u{11fd4}\\u{12000}-\\u{12399}\\u{12400}-\\u{1246e}\\u{12480}-\\u{12543}\\u{12f90}-\\u{12ff0}\\u{13000}-\\u{1342f}\\u{13441}-\\u{13446}\\u{14400}-\\u{14646}\\u{16800}-\\u{16a38}\\u{16a40}-\\u{16a5e}\\u{16a60}-\\u{16a69}\\u{16a70}-\\u{16abe}\\u{16ac0}-\\u{16ac9}\\u{16ad0}-\\u{16aed}\\u{16b00}-\\u{16b2f}\\u{16b40}-\\u{16b43}\\u{16b50}-\\u{16b59}\\u{16b5b}-\\u{16b61}\\u{16b63}-\\u{16b77}\\u{16b7d}-\\u{16b8f}\\u{16e40}-\\u{16e96}\\u{16f00}-\\u{16f4a}\\u{16f50}\\u{16f93}-\\u{16f9f}\\u{16fe0}-\\u{16fe1}\\u{16fe3}\\u{17000}-\\u{187f7}\\u{18800}-\\u{18cd5}\\u{18d00}-\\u{18d08}\\u{1aff0}-\\u{1aff3}\\u{1aff5}-\\u{1affb}\\u{1affd}-\\u{1affe}\\u{1b000}-\\u{1b122}\\u{1b132}\\u{1b150}-\\u{1b152}\\u{1b155}\\u{1b164}-\\u{1b167}\\u{1b170}-\\u{1b2fb}\\u{1bc00}-\\u{1bc6a}\\u{1bc70}-\\u{1bc7c}\\u{1bc80}-\\u{1bc88}\\u{1bc90}-\\u{1bc99}\\u{1d2c0}-\\u{1d2d3}\\u{1d2e0}-\\u{1d2f3}\\u{1d360}-\\u{1d378}\\u{1d400}-\\u{1d454}\\u{1d456}-\\u{1d49c}\\u{1d49e}-\\u{1d49f}\\u{1d4a2}\\u{1d4a5}-\\u{1d4a6}\\u{1d4a9}-\\u{1d4ac}\\u{1d4ae}-\\u{1d4b9}\\u{1d4bb}\\u{1d4bd}-\\u{1d4c3}\\u{1d4c5}-\\u{1d505}\\u{1d507}-\\u{1d50a}\\u{1d50d}-\\u{1d514}\\u{1d516}-\\u{1d51c}\\u{1d51e}-\\u{1d539}\\u{1d53b}-\\u{1d53e}\\u{1d540}-\\u{1d544}\\u{1d546}\\u{1d54a}-\\u{1d550}\\u{1d552}-\\u{1d6a5}\\u{1d6a8}-\\u{1d6c0}\\u{1d6c2}-\\u{1d6da}\\u{1d6dc}-\\u{1d6fa}\\u{1d6fc}-\\u{1d714}\\u{1d716}-\\u{1d734}\\u{1d736}-\\u{1d74e}\\u{1d750}-\\u{1d76e}\\u{1d770}-\\u{1d788}\\u{1d78a}-\\u{1d7a8}\\u{1d7aa}-\\u{1d7c2}\\u{1d7c4}-\\u{1d7cb}\\u{1d7ce}-\\u{1d7ff}\\u{1df00}-\\u{1df1e}\\u{1df25}-\\u{1df2a}\\u{1e030}-\\u{1e06d}\\u{1e100}-\\u{1e12c}\\u{1e137}-\\u{1e13d}\\u{1e140}-\\u{1e149}\\u{1e14e}\\u{1e290}-\\u{1e2ad}\\u{1e2c0}-\\u{1e2eb}\\u{1e2f0}-\\u{1e2f9}\\u{1e4d0}-\\u{1e4eb}\\u{1e4f0}-\\u{1e4f9}\\u{1e7e0}-\\u{1e7e6}\\u{1e7e8}-\\u{1e7eb}\\u{1e7ed}-\\u{1e7ee}\\u{1e7f0}-\\u{1e7fe}\\u{1e800}-\\u{1e8c4}\\u{1e8c7}-\\u{1e8cf}\\u{1e900}-\\u{1e943}\\u{1e94b}\\u{1e950}-\\u{1e959}\\u{1ec71}-\\u{1ecab}\\u{1ecad}-\\u{1ecaf}\\u{1ecb1}-\\u{1ecb4}\\u{1ed01}-\\u{1ed2d}\\u{1ed2f}-\\u{1ed3d}\\u{1ee00}-\\u{1ee03}\\u{1ee05}-\\u{1ee1f}\\u{1ee21}-\\u{1ee22}\\u{1ee24}\\u{1ee27}\\u{1ee29}-\\u{1ee32}\\u{1ee34}-\\u{1ee37}\\u{1ee39}\\u{1ee3b}\\u{1ee42}\\u{1ee47}\\u{1ee49}\\u{1ee4b}\\u{1ee4d}-\\u{1ee4f}\\u{1ee51}-\\u{1ee52}\\u{1ee54}\\u{1ee57}\\u{1ee59}\\u{1ee5b}\\u{1ee5d}\\u{1ee5f}\\u{1ee61}-\\u{1ee62}\\u{1ee64}\\u{1ee67}-\\u{1ee6a}\\u{1ee6c}-\\u{1ee72}\\u{1ee74}-\\u{1ee77}\\u{1ee79}-\\u{1ee7c}\\u{1ee7e}\\u{1ee80}-\\u{1ee89}\\u{1ee8b}-\\u{1ee9b}\\u{1eea1}-\\u{1eea3}\\u{1eea5}-\\u{1eea9}\\u{1eeab}-\\u{1eebb}\\u{1f100}-\\u{1f10c}\\u{1fbf0}-\\u{1fbf9}\\u{20000}-\\u{2a6df}\\u{2a700}-\\u{2b739}\\u{2b740}-\\u{2b81d}\\u{2b820}-\\u{2cea1}\\u{2ceb0}-\\u{2ebe0}\\u{2ebf0}-\\u{2ee5d}\\u{2f800}-\\u{2fa1d}\\u{30000}-\\u{3134a}\\u{31350}-\\u{323af} ,._:'–-]+(?=\\n?$)","type":"string"},"travel_end_date":{"pattern":"[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?","type":"string"},"travel_start_date":{"pattern":"[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?","type":"string"}},"required":["travel_country","travel_start_date","travel_end_date"],"type":"object"};

function validate98(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate98.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.travel_country === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/TravelInfo/required",keyword:"required",params:{missingProperty: "travel_country"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.travel_start_date === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/TravelInfo/required",keyword:"required",params:{missingProperty: "travel_start_date"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.travel_end_date === undefined){
const err2 = {instancePath,schemaPath:"#/$defs/TravelInfo/required",keyword:"required",params:{missingProperty: "travel_end_date"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.bed_net_usage !== undefined){
let data0 = data.bed_net_usage;
if((!((typeof data0 == "number") && (isFinite(data0)))) && (data0 !== null)){
const err3 = {instancePath:instancePath+"/bed_net_usage",schemaPath:"#/$defs/TravelInfo/properties/bed_net_usage/type",keyword:"type",params:{type: schema42.properties.bed_net_usage.type}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if((typeof data0 == "number") && (isFinite(data0))){
if(data0 < 0 || isNaN(data0)){
const err4 = {instancePath:instancePath+"/bed_net_usage",schemaPath:"#/$defs/TravelInfo/properties/bed_net_usage/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
if(data.geo_admin1 !== undefined){
let data1 = data.geo_admin1;
if((typeof data1 !== "string") && (data1 !== null)){
const err5 = {instancePath:instancePath+"/geo_admin1",schemaPath:"#/$defs/TravelInfo/properties/geo_admin1/type",keyword:"type",params:{type: schema42.properties.geo_admin1.type}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
if(data.geo_admin2 !== undefined){
let data2 = data.geo_admin2;
if((typeof data2 !== "string") && (data2 !== null)){
const err6 = {instancePath:instancePath+"/geo_admin2",schemaPath:"#/$defs/TravelInfo/properties/geo_admin2/type",keyword:"type",params:{type: schema42.properties.geo_admin2.type}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
if(data.geo_admin3 !== undefined){
let data3 = data.geo_admin3;
if((typeof data3 !== "string") && (data3 !== null)){
const err7 = {instancePath:instancePath+"/geo_admin3",schemaPath:"#/$defs/TravelInfo/properties/geo_admin3/type",keyword:"type",params:{type: schema42.properties.geo_admin3.type}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
if(data.lat_lon !== undefined){
let data4 = data.lat_lon;
if((typeof data4 !== "string") && (data4 !== null)){
const err8 = {instancePath:instancePath+"/lat_lon",schemaPath:"#/$defs/TravelInfo/properties/lat_lon/type",keyword:"type",params:{type: schema42.properties.lat_lon.type}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(typeof data4 === "string"){
if(!pattern88.test(data4)){
const err9 = {instancePath:instancePath+"/lat_lon",schemaPath:"#/$defs/TravelInfo/properties/lat_lon/pattern",keyword:"pattern",params:{pattern: "^[-+]?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{1,2}(?:\\.[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+)?,[-+]?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{1,3}(?:\\.[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+)?(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
if(data.travel_country !== undefined){
let data5 = data.travel_country;
if(typeof data5 === "string"){
if(!pattern78.test(data5)){
const err10 = {instancePath:instancePath+"/travel_country",schemaPath:"#/$defs/TravelInfo/properties/travel_country/pattern",keyword:"pattern",params:{pattern: "^[\\u{30}-\\u{39}\\u{41}-\\u{5a}\\u{5f}\\u{61}-\\u{7a}\\u{aa}\\u{b2}-\\u{b3}\\u{b5}\\u{b9}-\\u{ba}\\u{bc}-\\u{be}\\u{c0}-\\u{d6}\\u{d8}-\\u{f6}\\u{f8}-\\u{2c1}\\u{2c6}-\\u{2d1}\\u{2e0}-\\u{2e4}\\u{2ec}\\u{2ee}\\u{370}-\\u{374}\\u{376}-\\u{377}\\u{37a}-\\u{37d}\\u{37f}\\u{386}\\u{388}-\\u{38a}\\u{38c}\\u{38e}-\\u{3a1}\\u{3a3}-\\u{3f5}\\u{3f7}-\\u{481}\\u{48a}-\\u{52f}\\u{531}-\\u{556}\\u{559}\\u{560}-\\u{588}\\u{5d0}-\\u{5ea}\\u{5ef}-\\u{5f2}\\u{620}-\\u{64a}\\u{660}-\\u{669}\\u{66e}-\\u{66f}\\u{671}-\\u{6d3}\\u{6d5}\\u{6e5}-\\u{6e6}\\u{6ee}-\\u{6fc}\\u{6ff}\\u{710}\\u{712}-\\u{72f}\\u{74d}-\\u{7a5}\\u{7b1}\\u{7c0}-\\u{7ea}\\u{7f4}-\\u{7f5}\\u{7fa}\\u{800}-\\u{815}\\u{81a}\\u{824}\\u{828}\\u{840}-\\u{858}\\u{860}-\\u{86a}\\u{870}-\\u{887}\\u{889}-\\u{88e}\\u{8a0}-\\u{8c9}\\u{904}-\\u{939}\\u{93d}\\u{950}\\u{958}-\\u{961}\\u{966}-\\u{96f}\\u{971}-\\u{980}\\u{985}-\\u{98c}\\u{98f}-\\u{990}\\u{993}-\\u{9a8}\\u{9aa}-\\u{9b0}\\u{9b2}\\u{9b6}-\\u{9b9}\\u{9bd}\\u{9ce}\\u{9dc}-\\u{9dd}\\u{9df}-\\u{9e1}\\u{9e6}-\\u{9f1}\\u{9f4}-\\u{9f9}\\u{9fc}\\u{a05}-\\u{a0a}\\u{a0f}-\\u{a10}\\u{a13}-\\u{a28}\\u{a2a}-\\u{a30}\\u{a32}-\\u{a33}\\u{a35}-\\u{a36}\\u{a38}-\\u{a39}\\u{a59}-\\u{a5c}\\u{a5e}\\u{a66}-\\u{a6f}\\u{a72}-\\u{a74}\\u{a85}-\\u{a8d}\\u{a8f}-\\u{a91}\\u{a93}-\\u{aa8}\\u{aaa}-\\u{ab0}\\u{ab2}-\\u{ab3}\\u{ab5}-\\u{ab9}\\u{abd}\\u{ad0}\\u{ae0}-\\u{ae1}\\u{ae6}-\\u{aef}\\u{af9}\\u{b05}-\\u{b0c}\\u{b0f}-\\u{b10}\\u{b13}-\\u{b28}\\u{b2a}-\\u{b30}\\u{b32}-\\u{b33}\\u{b35}-\\u{b39}\\u{b3d}\\u{b5c}-\\u{b5d}\\u{b5f}-\\u{b61}\\u{b66}-\\u{b6f}\\u{b71}-\\u{b77}\\u{b83}\\u{b85}-\\u{b8a}\\u{b8e}-\\u{b90}\\u{b92}-\\u{b95}\\u{b99}-\\u{b9a}\\u{b9c}\\u{b9e}-\\u{b9f}\\u{ba3}-\\u{ba4}\\u{ba8}-\\u{baa}\\u{bae}-\\u{bb9}\\u{bd0}\\u{be6}-\\u{bf2}\\u{c05}-\\u{c0c}\\u{c0e}-\\u{c10}\\u{c12}-\\u{c28}\\u{c2a}-\\u{c39}\\u{c3d}\\u{c58}-\\u{c5a}\\u{c5d}\\u{c60}-\\u{c61}\\u{c66}-\\u{c6f}\\u{c78}-\\u{c7e}\\u{c80}\\u{c85}-\\u{c8c}\\u{c8e}-\\u{c90}\\u{c92}-\\u{ca8}\\u{caa}-\\u{cb3}\\u{cb5}-\\u{cb9}\\u{cbd}\\u{cdd}-\\u{cde}\\u{ce0}-\\u{ce1}\\u{ce6}-\\u{cef}\\u{cf1}-\\u{cf2}\\u{d04}-\\u{d0c}\\u{d0e}-\\u{d10}\\u{d12}-\\u{d3a}\\u{d3d}\\u{d4e}\\u{d54}-\\u{d56}\\u{d58}-\\u{d61}\\u{d66}-\\u{d78}\\u{d7a}-\\u{d7f}\\u{d85}-\\u{d96}\\u{d9a}-\\u{db1}\\u{db3}-\\u{dbb}\\u{dbd}\\u{dc0}-\\u{dc6}\\u{de6}-\\u{def}\\u{e01}-\\u{e30}\\u{e32}-\\u{e33}\\u{e40}-\\u{e46}\\u{e50}-\\u{e59}\\u{e81}-\\u{e82}\\u{e84}\\u{e86}-\\u{e8a}\\u{e8c}-\\u{ea3}\\u{ea5}\\u{ea7}-\\u{eb0}\\u{eb2}-\\u{eb3}\\u{ebd}\\u{ec0}-\\u{ec4}\\u{ec6}\\u{ed0}-\\u{ed9}\\u{edc}-\\u{edf}\\u{f00}\\u{f20}-\\u{f33}\\u{f40}-\\u{f47}\\u{f49}-\\u{f6c}\\u{f88}-\\u{f8c}\\u{1000}-\\u{102a}\\u{103f}-\\u{1049}\\u{1050}-\\u{1055}\\u{105a}-\\u{105d}\\u{1061}\\u{1065}-\\u{1066}\\u{106e}-\\u{1070}\\u{1075}-\\u{1081}\\u{108e}\\u{1090}-\\u{1099}\\u{10a0}-\\u{10c5}\\u{10c7}\\u{10cd}\\u{10d0}-\\u{10fa}\\u{10fc}-\\u{1248}\\u{124a}-\\u{124d}\\u{1250}-\\u{1256}\\u{1258}\\u{125a}-\\u{125d}\\u{1260}-\\u{1288}\\u{128a}-\\u{128d}\\u{1290}-\\u{12b0}\\u{12b2}-\\u{12b5}\\u{12b8}-\\u{12be}\\u{12c0}\\u{12c2}-\\u{12c5}\\u{12c8}-\\u{12d6}\\u{12d8}-\\u{1310}\\u{1312}-\\u{1315}\\u{1318}-\\u{135a}\\u{1369}-\\u{137c}\\u{1380}-\\u{138f}\\u{13a0}-\\u{13f5}\\u{13f8}-\\u{13fd}\\u{1401}-\\u{166c}\\u{166f}-\\u{167f}\\u{1681}-\\u{169a}\\u{16a0}-\\u{16ea}\\u{16ee}-\\u{16f8}\\u{1700}-\\u{1711}\\u{171f}-\\u{1731}\\u{1740}-\\u{1751}\\u{1760}-\\u{176c}\\u{176e}-\\u{1770}\\u{1780}-\\u{17b3}\\u{17d7}\\u{17dc}\\u{17e0}-\\u{17e9}\\u{17f0}-\\u{17f9}\\u{1810}-\\u{1819}\\u{1820}-\\u{1878}\\u{1880}-\\u{1884}\\u{1887}-\\u{18a8}\\u{18aa}\\u{18b0}-\\u{18f5}\\u{1900}-\\u{191e}\\u{1946}-\\u{196d}\\u{1970}-\\u{1974}\\u{1980}-\\u{19ab}\\u{19b0}-\\u{19c9}\\u{19d0}-\\u{19da}\\u{1a00}-\\u{1a16}\\u{1a20}-\\u{1a54}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1aa7}\\u{1b05}-\\u{1b33}\\u{1b45}-\\u{1b4c}\\u{1b50}-\\u{1b59}\\u{1b83}-\\u{1ba0}\\u{1bae}-\\u{1be5}\\u{1c00}-\\u{1c23}\\u{1c40}-\\u{1c49}\\u{1c4d}-\\u{1c7d}\\u{1c80}-\\u{1c88}\\u{1c90}-\\u{1cba}\\u{1cbd}-\\u{1cbf}\\u{1ce9}-\\u{1cec}\\u{1cee}-\\u{1cf3}\\u{1cf5}-\\u{1cf6}\\u{1cfa}\\u{1d00}-\\u{1dbf}\\u{1e00}-\\u{1f15}\\u{1f18}-\\u{1f1d}\\u{1f20}-\\u{1f45}\\u{1f48}-\\u{1f4d}\\u{1f50}-\\u{1f57}\\u{1f59}\\u{1f5b}\\u{1f5d}\\u{1f5f}-\\u{1f7d}\\u{1f80}-\\u{1fb4}\\u{1fb6}-\\u{1fbc}\\u{1fbe}\\u{1fc2}-\\u{1fc4}\\u{1fc6}-\\u{1fcc}\\u{1fd0}-\\u{1fd3}\\u{1fd6}-\\u{1fdb}\\u{1fe0}-\\u{1fec}\\u{1ff2}-\\u{1ff4}\\u{1ff6}-\\u{1ffc}\\u{2070}-\\u{2071}\\u{2074}-\\u{2079}\\u{207f}-\\u{2089}\\u{2090}-\\u{209c}\\u{2102}\\u{2107}\\u{210a}-\\u{2113}\\u{2115}\\u{2119}-\\u{211d}\\u{2124}\\u{2126}\\u{2128}\\u{212a}-\\u{212d}\\u{212f}-\\u{2139}\\u{213c}-\\u{213f}\\u{2145}-\\u{2149}\\u{214e}\\u{2150}-\\u{2189}\\u{2460}-\\u{249b}\\u{24ea}-\\u{24ff}\\u{2776}-\\u{2793}\\u{2c00}-\\u{2ce4}\\u{2ceb}-\\u{2cee}\\u{2cf2}-\\u{2cf3}\\u{2cfd}\\u{2d00}-\\u{2d25}\\u{2d27}\\u{2d2d}\\u{2d30}-\\u{2d67}\\u{2d6f}\\u{2d80}-\\u{2d96}\\u{2da0}-\\u{2da6}\\u{2da8}-\\u{2dae}\\u{2db0}-\\u{2db6}\\u{2db8}-\\u{2dbe}\\u{2dc0}-\\u{2dc6}\\u{2dc8}-\\u{2dce}\\u{2dd0}-\\u{2dd6}\\u{2dd8}-\\u{2dde}\\u{2e2f}\\u{3005}-\\u{3007}\\u{3021}-\\u{3029}\\u{3031}-\\u{3035}\\u{3038}-\\u{303c}\\u{3041}-\\u{3096}\\u{309d}-\\u{309f}\\u{30a1}-\\u{30fa}\\u{30fc}-\\u{30ff}\\u{3105}-\\u{312f}\\u{3131}-\\u{318e}\\u{3192}-\\u{3195}\\u{31a0}-\\u{31bf}\\u{31f0}-\\u{31ff}\\u{3220}-\\u{3229}\\u{3248}-\\u{324f}\\u{3251}-\\u{325f}\\u{3280}-\\u{3289}\\u{32b1}-\\u{32bf}\\u{3400}-\\u{4dbf}\\u{4e00}-\\u{a48c}\\u{a4d0}-\\u{a4fd}\\u{a500}-\\u{a60c}\\u{a610}-\\u{a62b}\\u{a640}-\\u{a66e}\\u{a67f}-\\u{a69d}\\u{a6a0}-\\u{a6ef}\\u{a717}-\\u{a71f}\\u{a722}-\\u{a788}\\u{a78b}-\\u{a7ca}\\u{a7d0}-\\u{a7d1}\\u{a7d3}\\u{a7d5}-\\u{a7d9}\\u{a7f2}-\\u{a801}\\u{a803}-\\u{a805}\\u{a807}-\\u{a80a}\\u{a80c}-\\u{a822}\\u{a830}-\\u{a835}\\u{a840}-\\u{a873}\\u{a882}-\\u{a8b3}\\u{a8d0}-\\u{a8d9}\\u{a8f2}-\\u{a8f7}\\u{a8fb}\\u{a8fd}-\\u{a8fe}\\u{a900}-\\u{a925}\\u{a930}-\\u{a946}\\u{a960}-\\u{a97c}\\u{a984}-\\u{a9b2}\\u{a9cf}-\\u{a9d9}\\u{a9e0}-\\u{a9e4}\\u{a9e6}-\\u{a9fe}\\u{aa00}-\\u{aa28}\\u{aa40}-\\u{aa42}\\u{aa44}-\\u{aa4b}\\u{aa50}-\\u{aa59}\\u{aa60}-\\u{aa76}\\u{aa7a}\\u{aa7e}-\\u{aaaf}\\u{aab1}\\u{aab5}-\\u{aab6}\\u{aab9}-\\u{aabd}\\u{aac0}\\u{aac2}\\u{aadb}-\\u{aadd}\\u{aae0}-\\u{aaea}\\u{aaf2}-\\u{aaf4}\\u{ab01}-\\u{ab06}\\u{ab09}-\\u{ab0e}\\u{ab11}-\\u{ab16}\\u{ab20}-\\u{ab26}\\u{ab28}-\\u{ab2e}\\u{ab30}-\\u{ab5a}\\u{ab5c}-\\u{ab69}\\u{ab70}-\\u{abe2}\\u{abf0}-\\u{abf9}\\u{ac00}-\\u{d7a3}\\u{d7b0}-\\u{d7c6}\\u{d7cb}-\\u{d7fb}\\u{f900}-\\u{fa6d}\\u{fa70}-\\u{fad9}\\u{fb00}-\\u{fb06}\\u{fb13}-\\u{fb17}\\u{fb1d}\\u{fb1f}-\\u{fb28}\\u{fb2a}-\\u{fb36}\\u{fb38}-\\u{fb3c}\\u{fb3e}\\u{fb40}-\\u{fb41}\\u{fb43}-\\u{fb44}\\u{fb46}-\\u{fbb1}\\u{fbd3}-\\u{fd3d}\\u{fd50}-\\u{fd8f}\\u{fd92}-\\u{fdc7}\\u{fdf0}-\\u{fdfb}\\u{fe70}-\\u{fe74}\\u{fe76}-\\u{fefc}\\u{ff10}-\\u{ff19}\\u{ff21}-\\u{ff3a}\\u{ff41}-\\u{ff5a}\\u{ff66}-\\u{ffbe}\\u{ffc2}-\\u{ffc7}\\u{ffca}-\\u{ffcf}\\u{ffd2}-\\u{ffd7}\\u{ffda}-\\u{ffdc}\\u{10000}-\\u{1000b}\\u{1000d}-\\u{10026}\\u{10028}-\\u{1003a}\\u{1003c}-\\u{1003d}\\u{1003f}-\\u{1004d}\\u{10050}-\\u{1005d}\\u{10080}-\\u{100fa}\\u{10107}-\\u{10133}\\u{10140}-\\u{10178}\\u{1018a}-\\u{1018b}\\u{10280}-\\u{1029c}\\u{102a0}-\\u{102d0}\\u{102e1}-\\u{102fb}\\u{10300}-\\u{10323}\\u{1032d}-\\u{1034a}\\u{10350}-\\u{10375}\\u{10380}-\\u{1039d}\\u{103a0}-\\u{103c3}\\u{103c8}-\\u{103cf}\\u{103d1}-\\u{103d5}\\u{10400}-\\u{1049d}\\u{104a0}-\\u{104a9}\\u{104b0}-\\u{104d3}\\u{104d8}-\\u{104fb}\\u{10500}-\\u{10527}\\u{10530}-\\u{10563}\\u{10570}-\\u{1057a}\\u{1057c}-\\u{1058a}\\u{1058c}-\\u{10592}\\u{10594}-\\u{10595}\\u{10597}-\\u{105a1}\\u{105a3}-\\u{105b1}\\u{105b3}-\\u{105b9}\\u{105bb}-\\u{105bc}\\u{10600}-\\u{10736}\\u{10740}-\\u{10755}\\u{10760}-\\u{10767}\\u{10780}-\\u{10785}\\u{10787}-\\u{107b0}\\u{107b2}-\\u{107ba}\\u{10800}-\\u{10805}\\u{10808}\\u{1080a}-\\u{10835}\\u{10837}-\\u{10838}\\u{1083c}\\u{1083f}-\\u{10855}\\u{10858}-\\u{10876}\\u{10879}-\\u{1089e}\\u{108a7}-\\u{108af}\\u{108e0}-\\u{108f2}\\u{108f4}-\\u{108f5}\\u{108fb}-\\u{1091b}\\u{10920}-\\u{10939}\\u{10980}-\\u{109b7}\\u{109bc}-\\u{109cf}\\u{109d2}-\\u{10a00}\\u{10a10}-\\u{10a13}\\u{10a15}-\\u{10a17}\\u{10a19}-\\u{10a35}\\u{10a40}-\\u{10a48}\\u{10a60}-\\u{10a7e}\\u{10a80}-\\u{10a9f}\\u{10ac0}-\\u{10ac7}\\u{10ac9}-\\u{10ae4}\\u{10aeb}-\\u{10aef}\\u{10b00}-\\u{10b35}\\u{10b40}-\\u{10b55}\\u{10b58}-\\u{10b72}\\u{10b78}-\\u{10b91}\\u{10ba9}-\\u{10baf}\\u{10c00}-\\u{10c48}\\u{10c80}-\\u{10cb2}\\u{10cc0}-\\u{10cf2}\\u{10cfa}-\\u{10d23}\\u{10d30}-\\u{10d39}\\u{10e60}-\\u{10e7e}\\u{10e80}-\\u{10ea9}\\u{10eb0}-\\u{10eb1}\\u{10f00}-\\u{10f27}\\u{10f30}-\\u{10f45}\\u{10f51}-\\u{10f54}\\u{10f70}-\\u{10f81}\\u{10fb0}-\\u{10fcb}\\u{10fe0}-\\u{10ff6}\\u{11003}-\\u{11037}\\u{11052}-\\u{1106f}\\u{11071}-\\u{11072}\\u{11075}\\u{11083}-\\u{110af}\\u{110d0}-\\u{110e8}\\u{110f0}-\\u{110f9}\\u{11103}-\\u{11126}\\u{11136}-\\u{1113f}\\u{11144}\\u{11147}\\u{11150}-\\u{11172}\\u{11176}\\u{11183}-\\u{111b2}\\u{111c1}-\\u{111c4}\\u{111d0}-\\u{111da}\\u{111dc}\\u{111e1}-\\u{111f4}\\u{11200}-\\u{11211}\\u{11213}-\\u{1122b}\\u{1123f}-\\u{11240}\\u{11280}-\\u{11286}\\u{11288}\\u{1128a}-\\u{1128d}\\u{1128f}-\\u{1129d}\\u{1129f}-\\u{112a8}\\u{112b0}-\\u{112de}\\u{112f0}-\\u{112f9}\\u{11305}-\\u{1130c}\\u{1130f}-\\u{11310}\\u{11313}-\\u{11328}\\u{1132a}-\\u{11330}\\u{11332}-\\u{11333}\\u{11335}-\\u{11339}\\u{1133d}\\u{11350}\\u{1135d}-\\u{11361}\\u{11400}-\\u{11434}\\u{11447}-\\u{1144a}\\u{11450}-\\u{11459}\\u{1145f}-\\u{11461}\\u{11480}-\\u{114af}\\u{114c4}-\\u{114c5}\\u{114c7}\\u{114d0}-\\u{114d9}\\u{11580}-\\u{115ae}\\u{115d8}-\\u{115db}\\u{11600}-\\u{1162f}\\u{11644}\\u{11650}-\\u{11659}\\u{11680}-\\u{116aa}\\u{116b8}\\u{116c0}-\\u{116c9}\\u{11700}-\\u{1171a}\\u{11730}-\\u{1173b}\\u{11740}-\\u{11746}\\u{11800}-\\u{1182b}\\u{118a0}-\\u{118f2}\\u{118ff}-\\u{11906}\\u{11909}\\u{1190c}-\\u{11913}\\u{11915}-\\u{11916}\\u{11918}-\\u{1192f}\\u{1193f}\\u{11941}\\u{11950}-\\u{11959}\\u{119a0}-\\u{119a7}\\u{119aa}-\\u{119d0}\\u{119e1}\\u{119e3}\\u{11a00}\\u{11a0b}-\\u{11a32}\\u{11a3a}\\u{11a50}\\u{11a5c}-\\u{11a89}\\u{11a9d}\\u{11ab0}-\\u{11af8}\\u{11c00}-\\u{11c08}\\u{11c0a}-\\u{11c2e}\\u{11c40}\\u{11c50}-\\u{11c6c}\\u{11c72}-\\u{11c8f}\\u{11d00}-\\u{11d06}\\u{11d08}-\\u{11d09}\\u{11d0b}-\\u{11d30}\\u{11d46}\\u{11d50}-\\u{11d59}\\u{11d60}-\\u{11d65}\\u{11d67}-\\u{11d68}\\u{11d6a}-\\u{11d89}\\u{11d98}\\u{11da0}-\\u{11da9}\\u{11ee0}-\\u{11ef2}\\u{11f02}\\u{11f04}-\\u{11f10}\\u{11f12}-\\u{11f33}\\u{11f50}-\\u{11f59}\\u{11fb0}\\u{11fc0}-\\u{11fd4}\\u{12000}-\\u{12399}\\u{12400}-\\u{1246e}\\u{12480}-\\u{12543}\\u{12f90}-\\u{12ff0}\\u{13000}-\\u{1342f}\\u{13441}-\\u{13446}\\u{14400}-\\u{14646}\\u{16800}-\\u{16a38}\\u{16a40}-\\u{16a5e}\\u{16a60}-\\u{16a69}\\u{16a70}-\\u{16abe}\\u{16ac0}-\\u{16ac9}\\u{16ad0}-\\u{16aed}\\u{16b00}-\\u{16b2f}\\u{16b40}-\\u{16b43}\\u{16b50}-\\u{16b59}\\u{16b5b}-\\u{16b61}\\u{16b63}-\\u{16b77}\\u{16b7d}-\\u{16b8f}\\u{16e40}-\\u{16e96}\\u{16f00}-\\u{16f4a}\\u{16f50}\\u{16f93}-\\u{16f9f}\\u{16fe0}-\\u{16fe1}\\u{16fe3}\\u{17000}-\\u{187f7}\\u{18800}-\\u{18cd5}\\u{18d00}-\\u{18d08}\\u{1aff0}-\\u{1aff3}\\u{1aff5}-\\u{1affb}\\u{1affd}-\\u{1affe}\\u{1b000}-\\u{1b122}\\u{1b132}\\u{1b150}-\\u{1b152}\\u{1b155}\\u{1b164}-\\u{1b167}\\u{1b170}-\\u{1b2fb}\\u{1bc00}-\\u{1bc6a}\\u{1bc70}-\\u{1bc7c}\\u{1bc80}-\\u{1bc88}\\u{1bc90}-\\u{1bc99}\\u{1d2c0}-\\u{1d2d3}\\u{1d2e0}-\\u{1d2f3}\\u{1d360}-\\u{1d378}\\u{1d400}-\\u{1d454}\\u{1d456}-\\u{1d49c}\\u{1d49e}-\\u{1d49f}\\u{1d4a2}\\u{1d4a5}-\\u{1d4a6}\\u{1d4a9}-\\u{1d4ac}\\u{1d4ae}-\\u{1d4b9}\\u{1d4bb}\\u{1d4bd}-\\u{1d4c3}\\u{1d4c5}-\\u{1d505}\\u{1d507}-\\u{1d50a}\\u{1d50d}-\\u{1d514}\\u{1d516}-\\u{1d51c}\\u{1d51e}-\\u{1d539}\\u{1d53b}-\\u{1d53e}\\u{1d540}-\\u{1d544}\\u{1d546}\\u{1d54a}-\\u{1d550}\\u{1d552}-\\u{1d6a5}\\u{1d6a8}-\\u{1d6c0}\\u{1d6c2}-\\u{1d6da}\\u{1d6dc}-\\u{1d6fa}\\u{1d6fc}-\\u{1d714}\\u{1d716}-\\u{1d734}\\u{1d736}-\\u{1d74e}\\u{1d750}-\\u{1d76e}\\u{1d770}-\\u{1d788}\\u{1d78a}-\\u{1d7a8}\\u{1d7aa}-\\u{1d7c2}\\u{1d7c4}-\\u{1d7cb}\\u{1d7ce}-\\u{1d7ff}\\u{1df00}-\\u{1df1e}\\u{1df25}-\\u{1df2a}\\u{1e030}-\\u{1e06d}\\u{1e100}-\\u{1e12c}\\u{1e137}-\\u{1e13d}\\u{1e140}-\\u{1e149}\\u{1e14e}\\u{1e290}-\\u{1e2ad}\\u{1e2c0}-\\u{1e2eb}\\u{1e2f0}-\\u{1e2f9}\\u{1e4d0}-\\u{1e4eb}\\u{1e4f0}-\\u{1e4f9}\\u{1e7e0}-\\u{1e7e6}\\u{1e7e8}-\\u{1e7eb}\\u{1e7ed}-\\u{1e7ee}\\u{1e7f0}-\\u{1e7fe}\\u{1e800}-\\u{1e8c4}\\u{1e8c7}-\\u{1e8cf}\\u{1e900}-\\u{1e943}\\u{1e94b}\\u{1e950}-\\u{1e959}\\u{1ec71}-\\u{1ecab}\\u{1ecad}-\\u{1ecaf}\\u{1ecb1}-\\u{1ecb4}\\u{1ed01}-\\u{1ed2d}\\u{1ed2f}-\\u{1ed3d}\\u{1ee00}-\\u{1ee03}\\u{1ee05}-\\u{1ee1f}\\u{1ee21}-\\u{1ee22}\\u{1ee24}\\u{1ee27}\\u{1ee29}-\\u{1ee32}\\u{1ee34}-\\u{1ee37}\\u{1ee39}\\u{1ee3b}\\u{1ee42}\\u{1ee47}\\u{1ee49}\\u{1ee4b}\\u{1ee4d}-\\u{1ee4f}\\u{1ee51}-\\u{1ee52}\\u{1ee54}\\u{1ee57}\\u{1ee59}\\u{1ee5b}\\u{1ee5d}\\u{1ee5f}\\u{1ee61}-\\u{1ee62}\\u{1ee64}\\u{1ee67}-\\u{1ee6a}\\u{1ee6c}-\\u{1ee72}\\u{1ee74}-\\u{1ee77}\\u{1ee79}-\\u{1ee7c}\\u{1ee7e}\\u{1ee80}-\\u{1ee89}\\u{1ee8b}-\\u{1ee9b}\\u{1eea1}-\\u{1eea3}\\u{1eea5}-\\u{1eea9}\\u{1eeab}-\\u{1eebb}\\u{1f100}-\\u{1f10c}\\u{1fbf0}-\\u{1fbf9}\\u{20000}-\\u{2a6df}\\u{2a700}-\\u{2b739}\\u{2b740}-\\u{2b81d}\\u{2b820}-\\u{2cea1}\\u{2ceb0}-\\u{2ebe0}\\u{2ebf0}-\\u{2ee5d}\\u{2f800}-\\u{2fa1d}\\u{30000}-\\u{3134a}\\u{31350}-\\u{323af} ,._:'–-]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/travel_country",schemaPath:"#/$defs/TravelInfo/properties/travel_country/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.travel_end_date !== undefined){
let data6 = data.travel_end_date;
if(typeof data6 === "string"){
if(!pattern9.test(data6)){
const err12 = {instancePath:instancePath+"/travel_end_date",schemaPath:"#/$defs/TravelInfo/properties/travel_end_date/pattern",keyword:"pattern",params:{pattern: "[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?"}};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
else {
const err13 = {instancePath:instancePath+"/travel_end_date",schemaPath:"#/$defs/TravelInfo/properties/travel_end_date/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
if(data.travel_start_date !== undefined){
let data7 = data.travel_start_date;
if(typeof data7 === "string"){
if(!pattern9.test(data7)){
const err14 = {instancePath:instancePath+"/travel_start_date",schemaPath:"#/$defs/TravelInfo/properties/travel_start_date/pattern",keyword:"pattern",params:{pattern: "[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?"}};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
else {
const err15 = {instancePath:instancePath+"/travel_start_date",schemaPath:"#/$defs/TravelInfo/properties/travel_start_date/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
else {
const err16 = {instancePath,schemaPath:"#/$defs/TravelInfo/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
validate98.errors = vErrors;
return errors === 0;
}
validate98.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate95(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate95.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.specimen_name === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/SpecimenInfo/required",keyword:"required",params:{missingProperty: "specimen_name"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.alternate_identifiers !== undefined){
let data0 = data.alternate_identifiers;
if((!(Array.isArray(data0))) && (data0 !== null)){
const err1 = {instancePath:instancePath+"/alternate_identifiers",schemaPath:"#/$defs/SpecimenInfo/properties/alternate_identifiers/type",keyword:"type",params:{type: schema41.properties.alternate_identifiers.type}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(Array.isArray(data0)){
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
let data1 = data0[i0];
if(typeof data1 === "string"){
if(!pattern3.test(data1)){
const err2 = {instancePath:instancePath+"/alternate_identifiers/" + i0,schemaPath:"#/$defs/SpecimenInfo/properties/alternate_identifiers/items/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/alternate_identifiers/" + i0,schemaPath:"#/$defs/SpecimenInfo/properties/alternate_identifiers/items/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
}
if(data.blood_meal !== undefined){
let data2 = data.blood_meal;
if((typeof data2 !== "boolean") && (data2 !== null)){
const err4 = {instancePath:instancePath+"/blood_meal",schemaPath:"#/$defs/SpecimenInfo/properties/blood_meal/type",keyword:"type",params:{type: schema41.properties.blood_meal.type}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
if(data.collection_country !== undefined){
let data3 = data.collection_country;
if((typeof data3 !== "string") && (data3 !== null)){
const err5 = {instancePath:instancePath+"/collection_country",schemaPath:"#/$defs/SpecimenInfo/properties/collection_country/type",keyword:"type",params:{type: schema41.properties.collection_country.type}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(typeof data3 === "string"){
if(!pattern78.test(data3)){
const err6 = {instancePath:instancePath+"/collection_country",schemaPath:"#/$defs/SpecimenInfo/properties/collection_country/pattern",keyword:"pattern",params:{pattern: "^[\\u{30}-\\u{39}\\u{41}-\\u{5a}\\u{5f}\\u{61}-\\u{7a}\\u{aa}\\u{b2}-\\u{b3}\\u{b5}\\u{b9}-\\u{ba}\\u{bc}-\\u{be}\\u{c0}-\\u{d6}\\u{d8}-\\u{f6}\\u{f8}-\\u{2c1}\\u{2c6}-\\u{2d1}\\u{2e0}-\\u{2e4}\\u{2ec}\\u{2ee}\\u{370}-\\u{374}\\u{376}-\\u{377}\\u{37a}-\\u{37d}\\u{37f}\\u{386}\\u{388}-\\u{38a}\\u{38c}\\u{38e}-\\u{3a1}\\u{3a3}-\\u{3f5}\\u{3f7}-\\u{481}\\u{48a}-\\u{52f}\\u{531}-\\u{556}\\u{559}\\u{560}-\\u{588}\\u{5d0}-\\u{5ea}\\u{5ef}-\\u{5f2}\\u{620}-\\u{64a}\\u{660}-\\u{669}\\u{66e}-\\u{66f}\\u{671}-\\u{6d3}\\u{6d5}\\u{6e5}-\\u{6e6}\\u{6ee}-\\u{6fc}\\u{6ff}\\u{710}\\u{712}-\\u{72f}\\u{74d}-\\u{7a5}\\u{7b1}\\u{7c0}-\\u{7ea}\\u{7f4}-\\u{7f5}\\u{7fa}\\u{800}-\\u{815}\\u{81a}\\u{824}\\u{828}\\u{840}-\\u{858}\\u{860}-\\u{86a}\\u{870}-\\u{887}\\u{889}-\\u{88e}\\u{8a0}-\\u{8c9}\\u{904}-\\u{939}\\u{93d}\\u{950}\\u{958}-\\u{961}\\u{966}-\\u{96f}\\u{971}-\\u{980}\\u{985}-\\u{98c}\\u{98f}-\\u{990}\\u{993}-\\u{9a8}\\u{9aa}-\\u{9b0}\\u{9b2}\\u{9b6}-\\u{9b9}\\u{9bd}\\u{9ce}\\u{9dc}-\\u{9dd}\\u{9df}-\\u{9e1}\\u{9e6}-\\u{9f1}\\u{9f4}-\\u{9f9}\\u{9fc}\\u{a05}-\\u{a0a}\\u{a0f}-\\u{a10}\\u{a13}-\\u{a28}\\u{a2a}-\\u{a30}\\u{a32}-\\u{a33}\\u{a35}-\\u{a36}\\u{a38}-\\u{a39}\\u{a59}-\\u{a5c}\\u{a5e}\\u{a66}-\\u{a6f}\\u{a72}-\\u{a74}\\u{a85}-\\u{a8d}\\u{a8f}-\\u{a91}\\u{a93}-\\u{aa8}\\u{aaa}-\\u{ab0}\\u{ab2}-\\u{ab3}\\u{ab5}-\\u{ab9}\\u{abd}\\u{ad0}\\u{ae0}-\\u{ae1}\\u{ae6}-\\u{aef}\\u{af9}\\u{b05}-\\u{b0c}\\u{b0f}-\\u{b10}\\u{b13}-\\u{b28}\\u{b2a}-\\u{b30}\\u{b32}-\\u{b33}\\u{b35}-\\u{b39}\\u{b3d}\\u{b5c}-\\u{b5d}\\u{b5f}-\\u{b61}\\u{b66}-\\u{b6f}\\u{b71}-\\u{b77}\\u{b83}\\u{b85}-\\u{b8a}\\u{b8e}-\\u{b90}\\u{b92}-\\u{b95}\\u{b99}-\\u{b9a}\\u{b9c}\\u{b9e}-\\u{b9f}\\u{ba3}-\\u{ba4}\\u{ba8}-\\u{baa}\\u{bae}-\\u{bb9}\\u{bd0}\\u{be6}-\\u{bf2}\\u{c05}-\\u{c0c}\\u{c0e}-\\u{c10}\\u{c12}-\\u{c28}\\u{c2a}-\\u{c39}\\u{c3d}\\u{c58}-\\u{c5a}\\u{c5d}\\u{c60}-\\u{c61}\\u{c66}-\\u{c6f}\\u{c78}-\\u{c7e}\\u{c80}\\u{c85}-\\u{c8c}\\u{c8e}-\\u{c90}\\u{c92}-\\u{ca8}\\u{caa}-\\u{cb3}\\u{cb5}-\\u{cb9}\\u{cbd}\\u{cdd}-\\u{cde}\\u{ce0}-\\u{ce1}\\u{ce6}-\\u{cef}\\u{cf1}-\\u{cf2}\\u{d04}-\\u{d0c}\\u{d0e}-\\u{d10}\\u{d12}-\\u{d3a}\\u{d3d}\\u{d4e}\\u{d54}-\\u{d56}\\u{d58}-\\u{d61}\\u{d66}-\\u{d78}\\u{d7a}-\\u{d7f}\\u{d85}-\\u{d96}\\u{d9a}-\\u{db1}\\u{db3}-\\u{dbb}\\u{dbd}\\u{dc0}-\\u{dc6}\\u{de6}-\\u{def}\\u{e01}-\\u{e30}\\u{e32}-\\u{e33}\\u{e40}-\\u{e46}\\u{e50}-\\u{e59}\\u{e81}-\\u{e82}\\u{e84}\\u{e86}-\\u{e8a}\\u{e8c}-\\u{ea3}\\u{ea5}\\u{ea7}-\\u{eb0}\\u{eb2}-\\u{eb3}\\u{ebd}\\u{ec0}-\\u{ec4}\\u{ec6}\\u{ed0}-\\u{ed9}\\u{edc}-\\u{edf}\\u{f00}\\u{f20}-\\u{f33}\\u{f40}-\\u{f47}\\u{f49}-\\u{f6c}\\u{f88}-\\u{f8c}\\u{1000}-\\u{102a}\\u{103f}-\\u{1049}\\u{1050}-\\u{1055}\\u{105a}-\\u{105d}\\u{1061}\\u{1065}-\\u{1066}\\u{106e}-\\u{1070}\\u{1075}-\\u{1081}\\u{108e}\\u{1090}-\\u{1099}\\u{10a0}-\\u{10c5}\\u{10c7}\\u{10cd}\\u{10d0}-\\u{10fa}\\u{10fc}-\\u{1248}\\u{124a}-\\u{124d}\\u{1250}-\\u{1256}\\u{1258}\\u{125a}-\\u{125d}\\u{1260}-\\u{1288}\\u{128a}-\\u{128d}\\u{1290}-\\u{12b0}\\u{12b2}-\\u{12b5}\\u{12b8}-\\u{12be}\\u{12c0}\\u{12c2}-\\u{12c5}\\u{12c8}-\\u{12d6}\\u{12d8}-\\u{1310}\\u{1312}-\\u{1315}\\u{1318}-\\u{135a}\\u{1369}-\\u{137c}\\u{1380}-\\u{138f}\\u{13a0}-\\u{13f5}\\u{13f8}-\\u{13fd}\\u{1401}-\\u{166c}\\u{166f}-\\u{167f}\\u{1681}-\\u{169a}\\u{16a0}-\\u{16ea}\\u{16ee}-\\u{16f8}\\u{1700}-\\u{1711}\\u{171f}-\\u{1731}\\u{1740}-\\u{1751}\\u{1760}-\\u{176c}\\u{176e}-\\u{1770}\\u{1780}-\\u{17b3}\\u{17d7}\\u{17dc}\\u{17e0}-\\u{17e9}\\u{17f0}-\\u{17f9}\\u{1810}-\\u{1819}\\u{1820}-\\u{1878}\\u{1880}-\\u{1884}\\u{1887}-\\u{18a8}\\u{18aa}\\u{18b0}-\\u{18f5}\\u{1900}-\\u{191e}\\u{1946}-\\u{196d}\\u{1970}-\\u{1974}\\u{1980}-\\u{19ab}\\u{19b0}-\\u{19c9}\\u{19d0}-\\u{19da}\\u{1a00}-\\u{1a16}\\u{1a20}-\\u{1a54}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1aa7}\\u{1b05}-\\u{1b33}\\u{1b45}-\\u{1b4c}\\u{1b50}-\\u{1b59}\\u{1b83}-\\u{1ba0}\\u{1bae}-\\u{1be5}\\u{1c00}-\\u{1c23}\\u{1c40}-\\u{1c49}\\u{1c4d}-\\u{1c7d}\\u{1c80}-\\u{1c88}\\u{1c90}-\\u{1cba}\\u{1cbd}-\\u{1cbf}\\u{1ce9}-\\u{1cec}\\u{1cee}-\\u{1cf3}\\u{1cf5}-\\u{1cf6}\\u{1cfa}\\u{1d00}-\\u{1dbf}\\u{1e00}-\\u{1f15}\\u{1f18}-\\u{1f1d}\\u{1f20}-\\u{1f45}\\u{1f48}-\\u{1f4d}\\u{1f50}-\\u{1f57}\\u{1f59}\\u{1f5b}\\u{1f5d}\\u{1f5f}-\\u{1f7d}\\u{1f80}-\\u{1fb4}\\u{1fb6}-\\u{1fbc}\\u{1fbe}\\u{1fc2}-\\u{1fc4}\\u{1fc6}-\\u{1fcc}\\u{1fd0}-\\u{1fd3}\\u{1fd6}-\\u{1fdb}\\u{1fe0}-\\u{1fec}\\u{1ff2}-\\u{1ff4}\\u{1ff6}-\\u{1ffc}\\u{2070}-\\u{2071}\\u{2074}-\\u{2079}\\u{207f}-\\u{2089}\\u{2090}-\\u{209c}\\u{2102}\\u{2107}\\u{210a}-\\u{2113}\\u{2115}\\u{2119}-\\u{211d}\\u{2124}\\u{2126}\\u{2128}\\u{212a}-\\u{212d}\\u{212f}-\\u{2139}\\u{213c}-\\u{213f}\\u{2145}-\\u{2149}\\u{214e}\\u{2150}-\\u{2189}\\u{2460}-\\u{249b}\\u{24ea}-\\u{24ff}\\u{2776}-\\u{2793}\\u{2c00}-\\u{2ce4}\\u{2ceb}-\\u{2cee}\\u{2cf2}-\\u{2cf3}\\u{2cfd}\\u{2d00}-\\u{2d25}\\u{2d27}\\u{2d2d}\\u{2d30}-\\u{2d67}\\u{2d6f}\\u{2d80}-\\u{2d96}\\u{2da0}-\\u{2da6}\\u{2da8}-\\u{2dae}\\u{2db0}-\\u{2db6}\\u{2db8}-\\u{2dbe}\\u{2dc0}-\\u{2dc6}\\u{2dc8}-\\u{2dce}\\u{2dd0}-\\u{2dd6}\\u{2dd8}-\\u{2dde}\\u{2e2f}\\u{3005}-\\u{3007}\\u{3021}-\\u{3029}\\u{3031}-\\u{3035}\\u{3038}-\\u{303c}\\u{3041}-\\u{3096}\\u{309d}-\\u{309f}\\u{30a1}-\\u{30fa}\\u{30fc}-\\u{30ff}\\u{3105}-\\u{312f}\\u{3131}-\\u{318e}\\u{3192}-\\u{3195}\\u{31a0}-\\u{31bf}\\u{31f0}-\\u{31ff}\\u{3220}-\\u{3229}\\u{3248}-\\u{324f}\\u{3251}-\\u{325f}\\u{3280}-\\u{3289}\\u{32b1}-\\u{32bf}\\u{3400}-\\u{4dbf}\\u{4e00}-\\u{a48c}\\u{a4d0}-\\u{a4fd}\\u{a500}-\\u{a60c}\\u{a610}-\\u{a62b}\\u{a640}-\\u{a66e}\\u{a67f}-\\u{a69d}\\u{a6a0}-\\u{a6ef}\\u{a717}-\\u{a71f}\\u{a722}-\\u{a788}\\u{a78b}-\\u{a7ca}\\u{a7d0}-\\u{a7d1}\\u{a7d3}\\u{a7d5}-\\u{a7d9}\\u{a7f2}-\\u{a801}\\u{a803}-\\u{a805}\\u{a807}-\\u{a80a}\\u{a80c}-\\u{a822}\\u{a830}-\\u{a835}\\u{a840}-\\u{a873}\\u{a882}-\\u{a8b3}\\u{a8d0}-\\u{a8d9}\\u{a8f2}-\\u{a8f7}\\u{a8fb}\\u{a8fd}-\\u{a8fe}\\u{a900}-\\u{a925}\\u{a930}-\\u{a946}\\u{a960}-\\u{a97c}\\u{a984}-\\u{a9b2}\\u{a9cf}-\\u{a9d9}\\u{a9e0}-\\u{a9e4}\\u{a9e6}-\\u{a9fe}\\u{aa00}-\\u{aa28}\\u{aa40}-\\u{aa42}\\u{aa44}-\\u{aa4b}\\u{aa50}-\\u{aa59}\\u{aa60}-\\u{aa76}\\u{aa7a}\\u{aa7e}-\\u{aaaf}\\u{aab1}\\u{aab5}-\\u{aab6}\\u{aab9}-\\u{aabd}\\u{aac0}\\u{aac2}\\u{aadb}-\\u{aadd}\\u{aae0}-\\u{aaea}\\u{aaf2}-\\u{aaf4}\\u{ab01}-\\u{ab06}\\u{ab09}-\\u{ab0e}\\u{ab11}-\\u{ab16}\\u{ab20}-\\u{ab26}\\u{ab28}-\\u{ab2e}\\u{ab30}-\\u{ab5a}\\u{ab5c}-\\u{ab69}\\u{ab70}-\\u{abe2}\\u{abf0}-\\u{abf9}\\u{ac00}-\\u{d7a3}\\u{d7b0}-\\u{d7c6}\\u{d7cb}-\\u{d7fb}\\u{f900}-\\u{fa6d}\\u{fa70}-\\u{fad9}\\u{fb00}-\\u{fb06}\\u{fb13}-\\u{fb17}\\u{fb1d}\\u{fb1f}-\\u{fb28}\\u{fb2a}-\\u{fb36}\\u{fb38}-\\u{fb3c}\\u{fb3e}\\u{fb40}-\\u{fb41}\\u{fb43}-\\u{fb44}\\u{fb46}-\\u{fbb1}\\u{fbd3}-\\u{fd3d}\\u{fd50}-\\u{fd8f}\\u{fd92}-\\u{fdc7}\\u{fdf0}-\\u{fdfb}\\u{fe70}-\\u{fe74}\\u{fe76}-\\u{fefc}\\u{ff10}-\\u{ff19}\\u{ff21}-\\u{ff3a}\\u{ff41}-\\u{ff5a}\\u{ff66}-\\u{ffbe}\\u{ffc2}-\\u{ffc7}\\u{ffca}-\\u{ffcf}\\u{ffd2}-\\u{ffd7}\\u{ffda}-\\u{ffdc}\\u{10000}-\\u{1000b}\\u{1000d}-\\u{10026}\\u{10028}-\\u{1003a}\\u{1003c}-\\u{1003d}\\u{1003f}-\\u{1004d}\\u{10050}-\\u{1005d}\\u{10080}-\\u{100fa}\\u{10107}-\\u{10133}\\u{10140}-\\u{10178}\\u{1018a}-\\u{1018b}\\u{10280}-\\u{1029c}\\u{102a0}-\\u{102d0}\\u{102e1}-\\u{102fb}\\u{10300}-\\u{10323}\\u{1032d}-\\u{1034a}\\u{10350}-\\u{10375}\\u{10380}-\\u{1039d}\\u{103a0}-\\u{103c3}\\u{103c8}-\\u{103cf}\\u{103d1}-\\u{103d5}\\u{10400}-\\u{1049d}\\u{104a0}-\\u{104a9}\\u{104b0}-\\u{104d3}\\u{104d8}-\\u{104fb}\\u{10500}-\\u{10527}\\u{10530}-\\u{10563}\\u{10570}-\\u{1057a}\\u{1057c}-\\u{1058a}\\u{1058c}-\\u{10592}\\u{10594}-\\u{10595}\\u{10597}-\\u{105a1}\\u{105a3}-\\u{105b1}\\u{105b3}-\\u{105b9}\\u{105bb}-\\u{105bc}\\u{10600}-\\u{10736}\\u{10740}-\\u{10755}\\u{10760}-\\u{10767}\\u{10780}-\\u{10785}\\u{10787}-\\u{107b0}\\u{107b2}-\\u{107ba}\\u{10800}-\\u{10805}\\u{10808}\\u{1080a}-\\u{10835}\\u{10837}-\\u{10838}\\u{1083c}\\u{1083f}-\\u{10855}\\u{10858}-\\u{10876}\\u{10879}-\\u{1089e}\\u{108a7}-\\u{108af}\\u{108e0}-\\u{108f2}\\u{108f4}-\\u{108f5}\\u{108fb}-\\u{1091b}\\u{10920}-\\u{10939}\\u{10980}-\\u{109b7}\\u{109bc}-\\u{109cf}\\u{109d2}-\\u{10a00}\\u{10a10}-\\u{10a13}\\u{10a15}-\\u{10a17}\\u{10a19}-\\u{10a35}\\u{10a40}-\\u{10a48}\\u{10a60}-\\u{10a7e}\\u{10a80}-\\u{10a9f}\\u{10ac0}-\\u{10ac7}\\u{10ac9}-\\u{10ae4}\\u{10aeb}-\\u{10aef}\\u{10b00}-\\u{10b35}\\u{10b40}-\\u{10b55}\\u{10b58}-\\u{10b72}\\u{10b78}-\\u{10b91}\\u{10ba9}-\\u{10baf}\\u{10c00}-\\u{10c48}\\u{10c80}-\\u{10cb2}\\u{10cc0}-\\u{10cf2}\\u{10cfa}-\\u{10d23}\\u{10d30}-\\u{10d39}\\u{10e60}-\\u{10e7e}\\u{10e80}-\\u{10ea9}\\u{10eb0}-\\u{10eb1}\\u{10f00}-\\u{10f27}\\u{10f30}-\\u{10f45}\\u{10f51}-\\u{10f54}\\u{10f70}-\\u{10f81}\\u{10fb0}-\\u{10fcb}\\u{10fe0}-\\u{10ff6}\\u{11003}-\\u{11037}\\u{11052}-\\u{1106f}\\u{11071}-\\u{11072}\\u{11075}\\u{11083}-\\u{110af}\\u{110d0}-\\u{110e8}\\u{110f0}-\\u{110f9}\\u{11103}-\\u{11126}\\u{11136}-\\u{1113f}\\u{11144}\\u{11147}\\u{11150}-\\u{11172}\\u{11176}\\u{11183}-\\u{111b2}\\u{111c1}-\\u{111c4}\\u{111d0}-\\u{111da}\\u{111dc}\\u{111e1}-\\u{111f4}\\u{11200}-\\u{11211}\\u{11213}-\\u{1122b}\\u{1123f}-\\u{11240}\\u{11280}-\\u{11286}\\u{11288}\\u{1128a}-\\u{1128d}\\u{1128f}-\\u{1129d}\\u{1129f}-\\u{112a8}\\u{112b0}-\\u{112de}\\u{112f0}-\\u{112f9}\\u{11305}-\\u{1130c}\\u{1130f}-\\u{11310}\\u{11313}-\\u{11328}\\u{1132a}-\\u{11330}\\u{11332}-\\u{11333}\\u{11335}-\\u{11339}\\u{1133d}\\u{11350}\\u{1135d}-\\u{11361}\\u{11400}-\\u{11434}\\u{11447}-\\u{1144a}\\u{11450}-\\u{11459}\\u{1145f}-\\u{11461}\\u{11480}-\\u{114af}\\u{114c4}-\\u{114c5}\\u{114c7}\\u{114d0}-\\u{114d9}\\u{11580}-\\u{115ae}\\u{115d8}-\\u{115db}\\u{11600}-\\u{1162f}\\u{11644}\\u{11650}-\\u{11659}\\u{11680}-\\u{116aa}\\u{116b8}\\u{116c0}-\\u{116c9}\\u{11700}-\\u{1171a}\\u{11730}-\\u{1173b}\\u{11740}-\\u{11746}\\u{11800}-\\u{1182b}\\u{118a0}-\\u{118f2}\\u{118ff}-\\u{11906}\\u{11909}\\u{1190c}-\\u{11913}\\u{11915}-\\u{11916}\\u{11918}-\\u{1192f}\\u{1193f}\\u{11941}\\u{11950}-\\u{11959}\\u{119a0}-\\u{119a7}\\u{119aa}-\\u{119d0}\\u{119e1}\\u{119e3}\\u{11a00}\\u{11a0b}-\\u{11a32}\\u{11a3a}\\u{11a50}\\u{11a5c}-\\u{11a89}\\u{11a9d}\\u{11ab0}-\\u{11af8}\\u{11c00}-\\u{11c08}\\u{11c0a}-\\u{11c2e}\\u{11c40}\\u{11c50}-\\u{11c6c}\\u{11c72}-\\u{11c8f}\\u{11d00}-\\u{11d06}\\u{11d08}-\\u{11d09}\\u{11d0b}-\\u{11d30}\\u{11d46}\\u{11d50}-\\u{11d59}\\u{11d60}-\\u{11d65}\\u{11d67}-\\u{11d68}\\u{11d6a}-\\u{11d89}\\u{11d98}\\u{11da0}-\\u{11da9}\\u{11ee0}-\\u{11ef2}\\u{11f02}\\u{11f04}-\\u{11f10}\\u{11f12}-\\u{11f33}\\u{11f50}-\\u{11f59}\\u{11fb0}\\u{11fc0}-\\u{11fd4}\\u{12000}-\\u{12399}\\u{12400}-\\u{1246e}\\u{12480}-\\u{12543}\\u{12f90}-\\u{12ff0}\\u{13000}-\\u{1342f}\\u{13441}-\\u{13446}\\u{14400}-\\u{14646}\\u{16800}-\\u{16a38}\\u{16a40}-\\u{16a5e}\\u{16a60}-\\u{16a69}\\u{16a70}-\\u{16abe}\\u{16ac0}-\\u{16ac9}\\u{16ad0}-\\u{16aed}\\u{16b00}-\\u{16b2f}\\u{16b40}-\\u{16b43}\\u{16b50}-\\u{16b59}\\u{16b5b}-\\u{16b61}\\u{16b63}-\\u{16b77}\\u{16b7d}-\\u{16b8f}\\u{16e40}-\\u{16e96}\\u{16f00}-\\u{16f4a}\\u{16f50}\\u{16f93}-\\u{16f9f}\\u{16fe0}-\\u{16fe1}\\u{16fe3}\\u{17000}-\\u{187f7}\\u{18800}-\\u{18cd5}\\u{18d00}-\\u{18d08}\\u{1aff0}-\\u{1aff3}\\u{1aff5}-\\u{1affb}\\u{1affd}-\\u{1affe}\\u{1b000}-\\u{1b122}\\u{1b132}\\u{1b150}-\\u{1b152}\\u{1b155}\\u{1b164}-\\u{1b167}\\u{1b170}-\\u{1b2fb}\\u{1bc00}-\\u{1bc6a}\\u{1bc70}-\\u{1bc7c}\\u{1bc80}-\\u{1bc88}\\u{1bc90}-\\u{1bc99}\\u{1d2c0}-\\u{1d2d3}\\u{1d2e0}-\\u{1d2f3}\\u{1d360}-\\u{1d378}\\u{1d400}-\\u{1d454}\\u{1d456}-\\u{1d49c}\\u{1d49e}-\\u{1d49f}\\u{1d4a2}\\u{1d4a5}-\\u{1d4a6}\\u{1d4a9}-\\u{1d4ac}\\u{1d4ae}-\\u{1d4b9}\\u{1d4bb}\\u{1d4bd}-\\u{1d4c3}\\u{1d4c5}-\\u{1d505}\\u{1d507}-\\u{1d50a}\\u{1d50d}-\\u{1d514}\\u{1d516}-\\u{1d51c}\\u{1d51e}-\\u{1d539}\\u{1d53b}-\\u{1d53e}\\u{1d540}-\\u{1d544}\\u{1d546}\\u{1d54a}-\\u{1d550}\\u{1d552}-\\u{1d6a5}\\u{1d6a8}-\\u{1d6c0}\\u{1d6c2}-\\u{1d6da}\\u{1d6dc}-\\u{1d6fa}\\u{1d6fc}-\\u{1d714}\\u{1d716}-\\u{1d734}\\u{1d736}-\\u{1d74e}\\u{1d750}-\\u{1d76e}\\u{1d770}-\\u{1d788}\\u{1d78a}-\\u{1d7a8}\\u{1d7aa}-\\u{1d7c2}\\u{1d7c4}-\\u{1d7cb}\\u{1d7ce}-\\u{1d7ff}\\u{1df00}-\\u{1df1e}\\u{1df25}-\\u{1df2a}\\u{1e030}-\\u{1e06d}\\u{1e100}-\\u{1e12c}\\u{1e137}-\\u{1e13d}\\u{1e140}-\\u{1e149}\\u{1e14e}\\u{1e290}-\\u{1e2ad}\\u{1e2c0}-\\u{1e2eb}\\u{1e2f0}-\\u{1e2f9}\\u{1e4d0}-\\u{1e4eb}\\u{1e4f0}-\\u{1e4f9}\\u{1e7e0}-\\u{1e7e6}\\u{1e7e8}-\\u{1e7eb}\\u{1e7ed}-\\u{1e7ee}\\u{1e7f0}-\\u{1e7fe}\\u{1e800}-\\u{1e8c4}\\u{1e8c7}-\\u{1e8cf}\\u{1e900}-\\u{1e943}\\u{1e94b}\\u{1e950}-\\u{1e959}\\u{1ec71}-\\u{1ecab}\\u{1ecad}-\\u{1ecaf}\\u{1ecb1}-\\u{1ecb4}\\u{1ed01}-\\u{1ed2d}\\u{1ed2f}-\\u{1ed3d}\\u{1ee00}-\\u{1ee03}\\u{1ee05}-\\u{1ee1f}\\u{1ee21}-\\u{1ee22}\\u{1ee24}\\u{1ee27}\\u{1ee29}-\\u{1ee32}\\u{1ee34}-\\u{1ee37}\\u{1ee39}\\u{1ee3b}\\u{1ee42}\\u{1ee47}\\u{1ee49}\\u{1ee4b}\\u{1ee4d}-\\u{1ee4f}\\u{1ee51}-\\u{1ee52}\\u{1ee54}\\u{1ee57}\\u{1ee59}\\u{1ee5b}\\u{1ee5d}\\u{1ee5f}\\u{1ee61}-\\u{1ee62}\\u{1ee64}\\u{1ee67}-\\u{1ee6a}\\u{1ee6c}-\\u{1ee72}\\u{1ee74}-\\u{1ee77}\\u{1ee79}-\\u{1ee7c}\\u{1ee7e}\\u{1ee80}-\\u{1ee89}\\u{1ee8b}-\\u{1ee9b}\\u{1eea1}-\\u{1eea3}\\u{1eea5}-\\u{1eea9}\\u{1eeab}-\\u{1eebb}\\u{1f100}-\\u{1f10c}\\u{1fbf0}-\\u{1fbf9}\\u{20000}-\\u{2a6df}\\u{2a700}-\\u{2b739}\\u{2b740}-\\u{2b81d}\\u{2b820}-\\u{2cea1}\\u{2ceb0}-\\u{2ebe0}\\u{2ebf0}-\\u{2ee5d}\\u{2f800}-\\u{2fa1d}\\u{30000}-\\u{3134a}\\u{31350}-\\u{323af} ,._:'–-]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
}
if(data.collection_date !== undefined){
let data4 = data.collection_date;
if((typeof data4 !== "string") && (data4 !== null)){
const err7 = {instancePath:instancePath+"/collection_date",schemaPath:"#/$defs/SpecimenInfo/properties/collection_date/type",keyword:"type",params:{type: schema41.properties.collection_date.type}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(typeof data4 === "string"){
if(!pattern22.test(data4)){
const err8 = {instancePath:instancePath+"/collection_date",schemaPath:"#/$defs/SpecimenInfo/properties/collection_date/pattern",keyword:"pattern",params:{pattern: "(?:[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?)?|NA)"}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
}
if(data.drug_usage !== undefined){
let data5 = data.drug_usage;
if((!(Array.isArray(data5))) && (data5 !== null)){
const err9 = {instancePath:instancePath+"/drug_usage",schemaPath:"#/$defs/SpecimenInfo/properties/drug_usage/type",keyword:"type",params:{type: schema41.properties.drug_usage.type}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(Array.isArray(data5)){
const len1 = data5.length;
for(let i1=0; i1<len1; i1++){
let data6 = data5[i1];
if(typeof data6 === "string"){
if(!pattern36.test(data6)){
const err10 = {instancePath:instancePath+"/drug_usage/" + i1,schemaPath:"#/$defs/SpecimenInfo/properties/drug_usage/items/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/drug_usage/" + i1,schemaPath:"#/$defs/SpecimenInfo/properties/drug_usage/items/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
}
}
if(data.env_broad_scale !== undefined){
let data7 = data.env_broad_scale;
if((typeof data7 !== "string") && (data7 !== null)){
const err12 = {instancePath:instancePath+"/env_broad_scale",schemaPath:"#/$defs/SpecimenInfo/properties/env_broad_scale/type",keyword:"type",params:{type: schema41.properties.env_broad_scale.type}};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(typeof data7 === "string"){
if(!pattern36.test(data7)){
const err13 = {instancePath:instancePath+"/env_broad_scale",schemaPath:"#/$defs/SpecimenInfo/properties/env_broad_scale/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
}
}
if(data.env_local_scale !== undefined){
let data8 = data.env_local_scale;
if((typeof data8 !== "string") && (data8 !== null)){
const err14 = {instancePath:instancePath+"/env_local_scale",schemaPath:"#/$defs/SpecimenInfo/properties/env_local_scale/type",keyword:"type",params:{type: schema41.properties.env_local_scale.type}};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(typeof data8 === "string"){
if(!pattern36.test(data8)){
const err15 = {instancePath:instancePath+"/env_local_scale",schemaPath:"#/$defs/SpecimenInfo/properties/env_local_scale/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
if(data.env_medium !== undefined){
let data9 = data.env_medium;
if((typeof data9 !== "string") && (data9 !== null)){
const err16 = {instancePath:instancePath+"/env_medium",schemaPath:"#/$defs/SpecimenInfo/properties/env_medium/type",keyword:"type",params:{type: schema41.properties.env_medium.type}};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
if(typeof data9 === "string"){
if(!pattern36.test(data9)){
const err17 = {instancePath:instancePath+"/env_medium",schemaPath:"#/$defs/SpecimenInfo/properties/env_medium/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
}
if(data.geo_admin1 !== undefined){
let data10 = data.geo_admin1;
if((typeof data10 !== "string") && (data10 !== null)){
const err18 = {instancePath:instancePath+"/geo_admin1",schemaPath:"#/$defs/SpecimenInfo/properties/geo_admin1/type",keyword:"type",params:{type: schema41.properties.geo_admin1.type}};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
if(data.geo_admin2 !== undefined){
let data11 = data.geo_admin2;
if((typeof data11 !== "string") && (data11 !== null)){
const err19 = {instancePath:instancePath+"/geo_admin2",schemaPath:"#/$defs/SpecimenInfo/properties/geo_admin2/type",keyword:"type",params:{type: schema41.properties.geo_admin2.type}};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
}
if(data.geo_admin3 !== undefined){
let data12 = data.geo_admin3;
if((typeof data12 !== "string") && (data12 !== null)){
const err20 = {instancePath:instancePath+"/geo_admin3",schemaPath:"#/$defs/SpecimenInfo/properties/geo_admin3/type",keyword:"type",params:{type: schema41.properties.geo_admin3.type}};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
}
if(data.gravid !== undefined){
let data13 = data.gravid;
if((typeof data13 !== "boolean") && (data13 !== null)){
const err21 = {instancePath:instancePath+"/gravid",schemaPath:"#/$defs/SpecimenInfo/properties/gravid/type",keyword:"type",params:{type: schema41.properties.gravid.type}};
if(vErrors === null){
vErrors = [err21];
}
else {
vErrors.push(err21);
}
errors++;
}
}
if(data.gravidity !== undefined){
let data14 = data.gravidity;
if((!(((typeof data14 == "number") && (!(data14 % 1) && !isNaN(data14))) && (isFinite(data14)))) && (data14 !== null)){
const err22 = {instancePath:instancePath+"/gravidity",schemaPath:"#/$defs/SpecimenInfo/properties/gravidity/type",keyword:"type",params:{type: schema41.properties.gravidity.type}};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if((typeof data14 == "number") && (isFinite(data14))){
if(data14 < 0 || isNaN(data14)){
const err23 = {instancePath:instancePath+"/gravidity",schemaPath:"#/$defs/SpecimenInfo/properties/gravidity/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err23];
}
else {
vErrors.push(err23);
}
errors++;
}
}
if(typeof data14 === "string"){
if(!pattern7.test(data14)){
const err24 = {instancePath:instancePath+"/gravidity",schemaPath:"#/$defs/SpecimenInfo/properties/gravidity/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
if(data.has_travel_out_six_month !== undefined){
let data15 = data.has_travel_out_six_month;
if((typeof data15 !== "boolean") && (data15 !== null)){
const err25 = {instancePath:instancePath+"/has_travel_out_six_month",schemaPath:"#/$defs/SpecimenInfo/properties/has_travel_out_six_month/type",keyword:"type",params:{type: schema41.properties.has_travel_out_six_month.type}};
if(vErrors === null){
vErrors = [err25];
}
else {
vErrors.push(err25);
}
errors++;
}
}
if(data.host_age !== undefined){
let data16 = data.host_age;
if((!((typeof data16 == "number") && (isFinite(data16)))) && (data16 !== null)){
const err26 = {instancePath:instancePath+"/host_age",schemaPath:"#/$defs/SpecimenInfo/properties/host_age/type",keyword:"type",params:{type: schema41.properties.host_age.type}};
if(vErrors === null){
vErrors = [err26];
}
else {
vErrors.push(err26);
}
errors++;
}
if((typeof data16 == "number") && (isFinite(data16))){
if(data16 < 0 || isNaN(data16)){
const err27 = {instancePath:instancePath+"/host_age",schemaPath:"#/$defs/SpecimenInfo/properties/host_age/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err27];
}
else {
vErrors.push(err27);
}
errors++;
}
}
if(typeof data16 === "string"){
if(!pattern85.test(data16)){
const err28 = {instancePath:instancePath+"/host_age",schemaPath:"#/$defs/SpecimenInfo/properties/host_age/pattern",keyword:"pattern",params:{pattern: "^[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]*\\.?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err28];
}
else {
vErrors.push(err28);
}
errors++;
}
}
}
if(data.host_sex !== undefined){
let data17 = data.host_sex;
if((typeof data17 !== "string") && (data17 !== null)){
const err29 = {instancePath:instancePath+"/host_sex",schemaPath:"#/$defs/SpecimenInfo/properties/host_sex/type",keyword:"type",params:{type: schema41.properties.host_sex.type}};
if(vErrors === null){
vErrors = [err29];
}
else {
vErrors.push(err29);
}
errors++;
}
if(typeof data17 === "string"){
if(!pattern3.test(data17)){
const err30 = {instancePath:instancePath+"/host_sex",schemaPath:"#/$defs/SpecimenInfo/properties/host_sex/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err30];
}
else {
vErrors.push(err30);
}
errors++;
}
}
}
if(data.host_subject_name !== undefined){
let data18 = data.host_subject_name;
if((typeof data18 !== "string") && (data18 !== null)){
const err31 = {instancePath:instancePath+"/host_subject_name",schemaPath:"#/$defs/SpecimenInfo/properties/host_subject_name/type",keyword:"type",params:{type: schema41.properties.host_subject_name.type}};
if(vErrors === null){
vErrors = [err31];
}
else {
vErrors.push(err31);
}
errors++;
}
if((typeof data18 == "number") && (isFinite(data18))){
if(data18 < 0 || isNaN(data18)){
const err32 = {instancePath:instancePath+"/host_subject_name",schemaPath:"#/$defs/SpecimenInfo/properties/host_subject_name/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err32];
}
else {
vErrors.push(err32);
}
errors++;
}
}
}
if(data.host_taxon_id !== undefined){
let data19 = data.host_taxon_id;
if((!(((typeof data19 == "number") && (!(data19 % 1) && !isNaN(data19))) && (isFinite(data19)))) && (data19 !== null)){
const err33 = {instancePath:instancePath+"/host_taxon_id",schemaPath:"#/$defs/SpecimenInfo/properties/host_taxon_id/type",keyword:"type",params:{type: schema41.properties.host_taxon_id.type}};
if(vErrors === null){
vErrors = [err33];
}
else {
vErrors.push(err33);
}
errors++;
}
if((typeof data19 == "number") && (isFinite(data19))){
if(data19 < 0 || isNaN(data19)){
const err34 = {instancePath:instancePath+"/host_taxon_id",schemaPath:"#/$defs/SpecimenInfo/properties/host_taxon_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err34];
}
else {
vErrors.push(err34);
}
errors++;
}
}
if(typeof data19 === "string"){
if(!pattern7.test(data19)){
const err35 = {instancePath:instancePath+"/host_taxon_id",schemaPath:"#/$defs/SpecimenInfo/properties/host_taxon_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err35];
}
else {
vErrors.push(err35);
}
errors++;
}
}
}
if(data.lat_lon !== undefined){
let data20 = data.lat_lon;
if((typeof data20 !== "string") && (data20 !== null)){
const err36 = {instancePath:instancePath+"/lat_lon",schemaPath:"#/$defs/SpecimenInfo/properties/lat_lon/type",keyword:"type",params:{type: schema41.properties.lat_lon.type}};
if(vErrors === null){
vErrors = [err36];
}
else {
vErrors.push(err36);
}
errors++;
}
if(typeof data20 === "string"){
if(!pattern88.test(data20)){
const err37 = {instancePath:instancePath+"/lat_lon",schemaPath:"#/$defs/SpecimenInfo/properties/lat_lon/pattern",keyword:"pattern",params:{pattern: "^[-+]?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{1,2}(?:\\.[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+)?,[-+]?[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]{1,3}(?:\\.[\\u{30}-\\u{39}\\u{660}-\\u{669}\\u{6f0}-\\u{6f9}\\u{7c0}-\\u{7c9}\\u{966}-\\u{96f}\\u{9e6}-\\u{9ef}\\u{a66}-\\u{a6f}\\u{ae6}-\\u{aef}\\u{b66}-\\u{b6f}\\u{be6}-\\u{bef}\\u{c66}-\\u{c6f}\\u{ce6}-\\u{cef}\\u{d66}-\\u{d6f}\\u{de6}-\\u{def}\\u{e50}-\\u{e59}\\u{ed0}-\\u{ed9}\\u{f20}-\\u{f29}\\u{1040}-\\u{1049}\\u{1090}-\\u{1099}\\u{17e0}-\\u{17e9}\\u{1810}-\\u{1819}\\u{1946}-\\u{194f}\\u{19d0}-\\u{19d9}\\u{1a80}-\\u{1a89}\\u{1a90}-\\u{1a99}\\u{1b50}-\\u{1b59}\\u{1bb0}-\\u{1bb9}\\u{1c40}-\\u{1c49}\\u{1c50}-\\u{1c59}\\u{a620}-\\u{a629}\\u{a8d0}-\\u{a8d9}\\u{a900}-\\u{a909}\\u{a9d0}-\\u{a9d9}\\u{a9f0}-\\u{a9f9}\\u{aa50}-\\u{aa59}\\u{abf0}-\\u{abf9}\\u{ff10}-\\u{ff19}\\u{104a0}-\\u{104a9}\\u{10d30}-\\u{10d39}\\u{11066}-\\u{1106f}\\u{110f0}-\\u{110f9}\\u{11136}-\\u{1113f}\\u{111d0}-\\u{111d9}\\u{112f0}-\\u{112f9}\\u{11450}-\\u{11459}\\u{114d0}-\\u{114d9}\\u{11650}-\\u{11659}\\u{116c0}-\\u{116c9}\\u{11730}-\\u{11739}\\u{118e0}-\\u{118e9}\\u{11950}-\\u{11959}\\u{11c50}-\\u{11c59}\\u{11d50}-\\u{11d59}\\u{11da0}-\\u{11da9}\\u{11f50}-\\u{11f59}\\u{16a60}-\\u{16a69}\\u{16ac0}-\\u{16ac9}\\u{16b50}-\\u{16b59}\\u{1d7ce}-\\u{1d7ff}\\u{1e140}-\\u{1e149}\\u{1e2f0}-\\u{1e2f9}\\u{1e4f0}-\\u{1e4f9}\\u{1e950}-\\u{1e959}\\u{1fbf0}-\\u{1fbf9}]+)?(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err37];
}
else {
vErrors.push(err37);
}
errors++;
}
}
}
if(data.parasite_density_info !== undefined){
let data21 = data.parasite_density_info;
if((!(Array.isArray(data21))) && (data21 !== null)){
const err38 = {instancePath:instancePath+"/parasite_density_info",schemaPath:"#/$defs/SpecimenInfo/properties/parasite_density_info/type",keyword:"type",params:{type: schema41.properties.parasite_density_info.type}};
if(vErrors === null){
vErrors = [err38];
}
else {
vErrors.push(err38);
}
errors++;
}
if(Array.isArray(data21)){
const len2 = data21.length;
for(let i2=0; i2<len2; i2++){
if(!(validate54(data21[i2], {instancePath:instancePath+"/parasite_density_info/" + i2,parentData:data21,parentDataProperty:i2,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate54.errors : vErrors.concat(validate54.errors);
errors = vErrors.length;
}
}
}
}
if(data.project_id !== undefined){
let data23 = data.project_id;
if((!(((typeof data23 == "number") && (!(data23 % 1) && !isNaN(data23))) && (isFinite(data23)))) && (data23 !== null)){
const err39 = {instancePath:instancePath+"/project_id",schemaPath:"#/$defs/SpecimenInfo/properties/project_id/type",keyword:"type",params:{type: schema41.properties.project_id.type}};
if(vErrors === null){
vErrors = [err39];
}
else {
vErrors.push(err39);
}
errors++;
}
if((typeof data23 == "number") && (isFinite(data23))){
if(data23 < 0 || isNaN(data23)){
const err40 = {instancePath:instancePath+"/project_id",schemaPath:"#/$defs/SpecimenInfo/properties/project_id/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err40];
}
else {
vErrors.push(err40);
}
errors++;
}
}
if(typeof data23 === "string"){
if(!pattern7.test(data23)){
const err41 = {instancePath:instancePath+"/project_id",schemaPath:"#/$defs/SpecimenInfo/properties/project_id/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err41];
}
else {
vErrors.push(err41);
}
errors++;
}
}
}
if(data.specimen_accession !== undefined){
let data24 = data.specimen_accession;
if((typeof data24 !== "string") && (data24 !== null)){
const err42 = {instancePath:instancePath+"/specimen_accession",schemaPath:"#/$defs/SpecimenInfo/properties/specimen_accession/type",keyword:"type",params:{type: schema41.properties.specimen_accession.type}};
if(vErrors === null){
vErrors = [err42];
}
else {
vErrors.push(err42);
}
errors++;
}
if(typeof data24 === "string"){
if(!pattern3.test(data24)){
const err43 = {instancePath:instancePath+"/specimen_accession",schemaPath:"#/$defs/SpecimenInfo/properties/specimen_accession/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9 ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err43];
}
else {
vErrors.push(err43);
}
errors++;
}
}
}
if(data.specimen_collect_device !== undefined){
let data25 = data.specimen_collect_device;
if((typeof data25 !== "string") && (data25 !== null)){
const err44 = {instancePath:instancePath+"/specimen_collect_device",schemaPath:"#/$defs/SpecimenInfo/properties/specimen_collect_device/type",keyword:"type",params:{type: schema41.properties.specimen_collect_device.type}};
if(vErrors === null){
vErrors = [err44];
}
else {
vErrors.push(err44);
}
errors++;
}
if(typeof data25 === "string"){
if(!pattern4.test(data25)){
const err45 = {instancePath:instancePath+"/specimen_collect_device",schemaPath:"#/$defs/SpecimenInfo/properties/specimen_collect_device/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err45];
}
else {
vErrors.push(err45);
}
errors++;
}
}
}
if(data.specimen_comments !== undefined){
let data26 = data.specimen_comments;
if((!(Array.isArray(data26))) && (data26 !== null)){
const err46 = {instancePath:instancePath+"/specimen_comments",schemaPath:"#/$defs/SpecimenInfo/properties/specimen_comments/type",keyword:"type",params:{type: schema41.properties.specimen_comments.type}};
if(vErrors === null){
vErrors = [err46];
}
else {
vErrors.push(err46);
}
errors++;
}
if(Array.isArray(data26)){
const len3 = data26.length;
for(let i3=0; i3<len3; i3++){
let data27 = data26[i3];
if(typeof data27 === "string"){
if(!pattern4.test(data27)){
const err47 = {instancePath:instancePath+"/specimen_comments/" + i3,schemaPath:"#/$defs/SpecimenInfo/properties/specimen_comments/items/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err47];
}
else {
vErrors.push(err47);
}
errors++;
}
}
else {
const err48 = {instancePath:instancePath+"/specimen_comments/" + i3,schemaPath:"#/$defs/SpecimenInfo/properties/specimen_comments/items/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err48];
}
else {
vErrors.push(err48);
}
errors++;
}
}
}
}
if(data.specimen_name !== undefined){
let data28 = data.specimen_name;
if(typeof data28 === "string"){
if(!pattern4.test(data28)){
const err49 = {instancePath:instancePath+"/specimen_name",schemaPath:"#/$defs/SpecimenInfo/properties/specimen_name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err49];
}
else {
vErrors.push(err49);
}
errors++;
}
}
else {
const err50 = {instancePath:instancePath+"/specimen_name",schemaPath:"#/$defs/SpecimenInfo/properties/specimen_name/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err50];
}
else {
vErrors.push(err50);
}
errors++;
}
}
if(data.specimen_store_loc !== undefined){
let data29 = data.specimen_store_loc;
if((typeof data29 !== "string") && (data29 !== null)){
const err51 = {instancePath:instancePath+"/specimen_store_loc",schemaPath:"#/$defs/SpecimenInfo/properties/specimen_store_loc/type",keyword:"type",params:{type: schema41.properties.specimen_store_loc.type}};
if(vErrors === null){
vErrors = [err51];
}
else {
vErrors.push(err51);
}
errors++;
}
if(typeof data29 === "string"){
if(!pattern4.test(data29)){
const err52 = {instancePath:instancePath+"/specimen_store_loc",schemaPath:"#/$defs/SpecimenInfo/properties/specimen_store_loc/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err52];
}
else {
vErrors.push(err52);
}
errors++;
}
}
}
if(data.specimen_taxon_id !== undefined){
let data30 = data.specimen_taxon_id;
if((!(Array.isArray(data30))) && (data30 !== null)){
const err53 = {instancePath:instancePath+"/specimen_taxon_id",schemaPath:"#/$defs/SpecimenInfo/properties/specimen_taxon_id/type",keyword:"type",params:{type: schema41.properties.specimen_taxon_id.type}};
if(vErrors === null){
vErrors = [err53];
}
else {
vErrors.push(err53);
}
errors++;
}
if(Array.isArray(data30)){
const len4 = data30.length;
for(let i4=0; i4<len4; i4++){
let data31 = data30[i4];
if(!(((typeof data31 == "number") && (!(data31 % 1) && !isNaN(data31))) && (isFinite(data31)))){
const err54 = {instancePath:instancePath+"/specimen_taxon_id/" + i4,schemaPath:"#/$defs/SpecimenInfo/properties/specimen_taxon_id/items/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err54];
}
else {
vErrors.push(err54);
}
errors++;
}
if((typeof data31 == "number") && (isFinite(data31))){
if(data31 < 0 || isNaN(data31)){
const err55 = {instancePath:instancePath+"/specimen_taxon_id/" + i4,schemaPath:"#/$defs/SpecimenInfo/properties/specimen_taxon_id/items/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err55];
}
else {
vErrors.push(err55);
}
errors++;
}
}
if(typeof data31 === "string"){
if(!pattern7.test(data31)){
const err56 = {instancePath:instancePath+"/specimen_taxon_id/" + i4,schemaPath:"#/$defs/SpecimenInfo/properties/specimen_taxon_id/items/pattern",keyword:"pattern",params:{pattern: "^[0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err56];
}
else {
vErrors.push(err56);
}
errors++;
}
}
}
}
}
if(data.specimen_type !== undefined){
let data32 = data.specimen_type;
if((typeof data32 !== "string") && (data32 !== null)){
const err57 = {instancePath:instancePath+"/specimen_type",schemaPath:"#/$defs/SpecimenInfo/properties/specimen_type/type",keyword:"type",params:{type: schema41.properties.specimen_type.type}};
if(vErrors === null){
vErrors = [err57];
}
else {
vErrors.push(err57);
}
errors++;
}
if(typeof data32 === "string"){
if(!pattern4.test(data32)){
const err58 = {instancePath:instancePath+"/specimen_type",schemaPath:"#/$defs/SpecimenInfo/properties/specimen_type/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err58];
}
else {
vErrors.push(err58);
}
errors++;
}
}
}
if(data.storage_plate_info !== undefined){
let data33 = data.storage_plate_info;
const _errs68 = errors;
let valid11 = false;
const _errs69 = errors;
if(!(validate52(data33, {instancePath:instancePath+"/storage_plate_info",parentData:data,parentDataProperty:"storage_plate_info",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate52.errors : vErrors.concat(validate52.errors);
errors = vErrors.length;
}
var _valid0 = _errs69 === errors;
valid11 = valid11 || _valid0;
const _errs70 = errors;
if(data33 !== null){
const err59 = {instancePath:instancePath+"/storage_plate_info",schemaPath:"#/$defs/SpecimenInfo/properties/storage_plate_info/anyOf/1/type",keyword:"type",params:{type: "null"}};
if(vErrors === null){
vErrors = [err59];
}
else {
vErrors.push(err59);
}
errors++;
}
var _valid0 = _errs70 === errors;
valid11 = valid11 || _valid0;
if(!valid11){
const err60 = {instancePath:instancePath+"/storage_plate_info",schemaPath:"#/$defs/SpecimenInfo/properties/storage_plate_info/anyOf",keyword:"anyOf",params:{}};
if(vErrors === null){
vErrors = [err60];
}
else {
vErrors.push(err60);
}
errors++;
}
else {
errors = _errs68;
if(vErrors !== null){
if(_errs68){
vErrors.length = _errs68;
}
else {
vErrors = null;
}
}
}
}
if(data.travel_out_six_month !== undefined){
let data34 = data.travel_out_six_month;
if((!(Array.isArray(data34))) && (data34 !== null)){
const err61 = {instancePath:instancePath+"/travel_out_six_month",schemaPath:"#/$defs/SpecimenInfo/properties/travel_out_six_month/type",keyword:"type",params:{type: schema41.properties.travel_out_six_month.type}};
if(vErrors === null){
vErrors = [err61];
}
else {
vErrors.push(err61);
}
errors++;
}
if(Array.isArray(data34)){
const len5 = data34.length;
for(let i5=0; i5<len5; i5++){
if(!(validate98(data34[i5], {instancePath:instancePath+"/travel_out_six_month/" + i5,parentData:data34,parentDataProperty:i5,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate98.errors : vErrors.concat(validate98.errors);
errors = vErrors.length;
}
}
}
}
if(data.treatment_status !== undefined){
let data36 = data.treatment_status;
if((!(Array.isArray(data36))) && (data36 !== null)){
const err62 = {instancePath:instancePath+"/treatment_status",schemaPath:"#/$defs/SpecimenInfo/properties/treatment_status/type",keyword:"type",params:{type: schema41.properties.treatment_status.type}};
if(vErrors === null){
vErrors = [err62];
}
else {
vErrors.push(err62);
}
errors++;
}
if(Array.isArray(data36)){
const len6 = data36.length;
for(let i6=0; i6<len6; i6++){
let data37 = data36[i6];
if(typeof data37 === "string"){
if(!pattern36.test(data37)){
const err63 = {instancePath:instancePath+"/treatment_status/" + i6,schemaPath:"#/$defs/SpecimenInfo/properties/treatment_status/items/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9;|\\(\\),\\/ ]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err63];
}
else {
vErrors.push(err63);
}
errors++;
}
}
else {
const err64 = {instancePath:instancePath+"/treatment_status/" + i6,schemaPath:"#/$defs/SpecimenInfo/properties/treatment_status/items/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err64];
}
else {
vErrors.push(err64);
}
errors++;
}
}
}
}
}
else {
const err65 = {instancePath,schemaPath:"#/$defs/SpecimenInfo/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err65];
}
else {
vErrors.push(err65);
}
errors++;
}
validate95.errors = vErrors;
return errors === 0;
}
validate95.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema43 = {"additionalProperties":true,"properties":{"forward_primer":{"$ref":"#/$defs/PrimerInfo"},"gene_name":{"pattern":"^[A-z-._0-9:]+(?=\\n?$)","type":["string","null"]},"insert_location":{"anyOf":[{"$ref":"#/$defs/GenomicLocation"},{"type":"null"}]},"markers_of_interest":{"items":{"$ref":"#/$defs/MarkerOfInterest"},"type":["array","null"]},"reverse_primer":{"$ref":"#/$defs/PrimerInfo"},"target_attributes":{"items":{"type":"string"},"type":["array","null"]},"target_name":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"}},"required":["target_name","forward_primer","reverse_primer"],"type":"object"};
const schema44 = {"additionalProperties":true,"properties":{"location":{"anyOf":[{"$ref":"#/$defs/GenomicLocation"},{"type":"null"}]},"seq":{"pattern":"^[A-z]+(?=\\n?$)","type":"string"}},"required":["seq"],"type":"object"};

function validate102(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate102.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.seq === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/PrimerInfo/required",keyword:"required",params:{missingProperty: "seq"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.location !== undefined){
let data0 = data.location;
const _errs3 = errors;
let valid1 = false;
const _errs4 = errors;
if(!(validate77(data0, {instancePath:instancePath+"/location",parentData:data,parentDataProperty:"location",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate77.errors : vErrors.concat(validate77.errors);
errors = vErrors.length;
}
var _valid0 = _errs4 === errors;
valid1 = valid1 || _valid0;
const _errs5 = errors;
if(data0 !== null){
const err1 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/PrimerInfo/properties/location/anyOf/1/type",keyword:"type",params:{type: "null"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
var _valid0 = _errs5 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err2 = {instancePath:instancePath+"/location",schemaPath:"#/$defs/PrimerInfo/properties/location/anyOf",keyword:"anyOf",params:{}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
else {
errors = _errs3;
if(vErrors !== null){
if(_errs3){
vErrors.length = _errs3;
}
else {
vErrors = null;
}
}
}
}
if(data.seq !== undefined){
let data1 = data.seq;
if(typeof data1 === "string"){
if(!pattern59.test(data1)){
const err3 = {instancePath:instancePath+"/seq",schemaPath:"#/$defs/PrimerInfo/properties/seq/pattern",keyword:"pattern",params:{pattern: "^[A-z]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
else {
const err4 = {instancePath:instancePath+"/seq",schemaPath:"#/$defs/PrimerInfo/properties/seq/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
else {
const err5 = {instancePath,schemaPath:"#/$defs/PrimerInfo/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
validate102.errors = vErrors;
return errors === 0;
}
validate102.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema45 = {"additionalProperties":true,"properties":{"associations":{"items":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"},"type":["array","null"]},"marker_location":{"$ref":"#/$defs/GenomicLocation"}},"required":["marker_location"],"type":"object"};

function validate106(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate106.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.marker_location === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/MarkerOfInterest/required",keyword:"required",params:{missingProperty: "marker_location"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.associations !== undefined){
let data0 = data.associations;
if((!(Array.isArray(data0))) && (data0 !== null)){
const err1 = {instancePath:instancePath+"/associations",schemaPath:"#/$defs/MarkerOfInterest/properties/associations/type",keyword:"type",params:{type: schema45.properties.associations.type}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(Array.isArray(data0)){
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
let data1 = data0[i0];
if(typeof data1 === "string"){
if(!pattern15.test(data1)){
const err2 = {instancePath:instancePath+"/associations/" + i0,schemaPath:"#/$defs/MarkerOfInterest/properties/associations/items/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
}
else {
const err3 = {instancePath:instancePath+"/associations/" + i0,schemaPath:"#/$defs/MarkerOfInterest/properties/associations/items/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
}
}
}
if(data.marker_location !== undefined){
if(!(validate77(data.marker_location, {instancePath:instancePath+"/marker_location",parentData:data,parentDataProperty:"marker_location",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate77.errors : vErrors.concat(validate77.errors);
errors = vErrors.length;
}
}
}
else {
const err4 = {instancePath,schemaPath:"#/$defs/MarkerOfInterest/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
validate106.errors = vErrors;
return errors === 0;
}
validate106.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate101(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate101.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.target_name === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/TargetInfo/required",keyword:"required",params:{missingProperty: "target_name"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.forward_primer === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/TargetInfo/required",keyword:"required",params:{missingProperty: "forward_primer"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.reverse_primer === undefined){
const err2 = {instancePath,schemaPath:"#/$defs/TargetInfo/required",keyword:"required",params:{missingProperty: "reverse_primer"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.forward_primer !== undefined){
if(!(validate102(data.forward_primer, {instancePath:instancePath+"/forward_primer",parentData:data,parentDataProperty:"forward_primer",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate102.errors : vErrors.concat(validate102.errors);
errors = vErrors.length;
}
}
if(data.gene_name !== undefined){
let data1 = data.gene_name;
if((typeof data1 !== "string") && (data1 !== null)){
const err3 = {instancePath:instancePath+"/gene_name",schemaPath:"#/$defs/TargetInfo/properties/gene_name/type",keyword:"type",params:{type: schema43.properties.gene_name.type}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(typeof data1 === "string"){
if(!pattern53.test(data1)){
const err4 = {instancePath:instancePath+"/gene_name",schemaPath:"#/$defs/TargetInfo/properties/gene_name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9:]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
}
}
if(data.insert_location !== undefined){
let data2 = data.insert_location;
const _errs6 = errors;
let valid1 = false;
const _errs7 = errors;
if(!(validate77(data2, {instancePath:instancePath+"/insert_location",parentData:data,parentDataProperty:"insert_location",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate77.errors : vErrors.concat(validate77.errors);
errors = vErrors.length;
}
var _valid0 = _errs7 === errors;
valid1 = valid1 || _valid0;
const _errs8 = errors;
if(data2 !== null){
const err5 = {instancePath:instancePath+"/insert_location",schemaPath:"#/$defs/TargetInfo/properties/insert_location/anyOf/1/type",keyword:"type",params:{type: "null"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
var _valid0 = _errs8 === errors;
valid1 = valid1 || _valid0;
if(!valid1){
const err6 = {instancePath:instancePath+"/insert_location",schemaPath:"#/$defs/TargetInfo/properties/insert_location/anyOf",keyword:"anyOf",params:{}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
else {
errors = _errs6;
if(vErrors !== null){
if(_errs6){
vErrors.length = _errs6;
}
else {
vErrors = null;
}
}
}
}
if(data.markers_of_interest !== undefined){
let data3 = data.markers_of_interest;
if((!(Array.isArray(data3))) && (data3 !== null)){
const err7 = {instancePath:instancePath+"/markers_of_interest",schemaPath:"#/$defs/TargetInfo/properties/markers_of_interest/type",keyword:"type",params:{type: schema43.properties.markers_of_interest.type}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(Array.isArray(data3)){
const len0 = data3.length;
for(let i0=0; i0<len0; i0++){
if(!(validate106(data3[i0], {instancePath:instancePath+"/markers_of_interest/" + i0,parentData:data3,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate106.errors : vErrors.concat(validate106.errors);
errors = vErrors.length;
}
}
}
}
if(data.reverse_primer !== undefined){
if(!(validate102(data.reverse_primer, {instancePath:instancePath+"/reverse_primer",parentData:data,parentDataProperty:"reverse_primer",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate102.errors : vErrors.concat(validate102.errors);
errors = vErrors.length;
}
}
if(data.target_attributes !== undefined){
let data6 = data.target_attributes;
if((!(Array.isArray(data6))) && (data6 !== null)){
const err8 = {instancePath:instancePath+"/target_attributes",schemaPath:"#/$defs/TargetInfo/properties/target_attributes/type",keyword:"type",params:{type: schema43.properties.target_attributes.type}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(Array.isArray(data6)){
const len1 = data6.length;
for(let i1=0; i1<len1; i1++){
if(typeof data6[i1] !== "string"){
const err9 = {instancePath:instancePath+"/target_attributes/" + i1,schemaPath:"#/$defs/TargetInfo/properties/target_attributes/items/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
}
}
if(data.target_name !== undefined){
let data8 = data.target_name;
if(typeof data8 === "string"){
if(!pattern15.test(data8)){
const err10 = {instancePath:instancePath+"/target_name",schemaPath:"#/$defs/TargetInfo/properties/target_name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
else {
const err11 = {instancePath:instancePath+"/target_name",schemaPath:"#/$defs/TargetInfo/properties/target_name/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
}
else {
const err12 = {instancePath,schemaPath:"#/$defs/TargetInfo/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
validate101.errors = vErrors;
return errors === 0;
}
validate101.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

const schema46 = {"additionalProperties":true,"properties":{"chromosomes":{"items":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"},"type":["array","null"]},"genome_version":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"},"gff_url":{"pattern":"^(https?|ftp):\\/\\/[^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}/$.?#][^\\n][^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}]*(?=\\n?$)","type":["string","null"]},"name":{"pattern":"^[A-z-._0-9]+(?=\\n?$)","type":"string"},"taxon_id":{"items":{"minimum":0,"pattern":"^[0-9](?=\\n?$)","type":"integer"},"type":"array"},"url":{"pattern":"^(?:NA|(https?|ftp):\\/\\/[^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}/$.?#][^\\n][^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}]*)(?=\\n?$)","type":"string"}},"required":["name","genome_version","taxon_id","url"],"type":"object"};
const pattern110 = new RegExp("^[0-9](?=\\n?$)", "u");
const pattern111 = new RegExp("^(?:NA|(https?|ftp):\\/\\/[^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}/$.?#][^\\n][^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}]*)(?=\\n?$)", "u");

function validate111(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate111.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.name === undefined){
const err0 = {instancePath,schemaPath:"#/$defs/GenomeInfo/required",keyword:"required",params:{missingProperty: "name"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.genome_version === undefined){
const err1 = {instancePath,schemaPath:"#/$defs/GenomeInfo/required",keyword:"required",params:{missingProperty: "genome_version"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.taxon_id === undefined){
const err2 = {instancePath,schemaPath:"#/$defs/GenomeInfo/required",keyword:"required",params:{missingProperty: "taxon_id"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.url === undefined){
const err3 = {instancePath,schemaPath:"#/$defs/GenomeInfo/required",keyword:"required",params:{missingProperty: "url"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.chromosomes !== undefined){
let data0 = data.chromosomes;
if((!(Array.isArray(data0))) && (data0 !== null)){
const err4 = {instancePath:instancePath+"/chromosomes",schemaPath:"#/$defs/GenomeInfo/properties/chromosomes/type",keyword:"type",params:{type: schema46.properties.chromosomes.type}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(Array.isArray(data0)){
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
let data1 = data0[i0];
if(typeof data1 === "string"){
if(!pattern15.test(data1)){
const err5 = {instancePath:instancePath+"/chromosomes/" + i0,schemaPath:"#/$defs/GenomeInfo/properties/chromosomes/items/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
}
else {
const err6 = {instancePath:instancePath+"/chromosomes/" + i0,schemaPath:"#/$defs/GenomeInfo/properties/chromosomes/items/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
}
}
}
if(data.genome_version !== undefined){
let data2 = data.genome_version;
if(typeof data2 === "string"){
if(!pattern15.test(data2)){
const err7 = {instancePath:instancePath+"/genome_version",schemaPath:"#/$defs/GenomeInfo/properties/genome_version/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
}
else {
const err8 = {instancePath:instancePath+"/genome_version",schemaPath:"#/$defs/GenomeInfo/properties/genome_version/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
}
if(data.gff_url !== undefined){
let data3 = data.gff_url;
if((typeof data3 !== "string") && (data3 !== null)){
const err9 = {instancePath:instancePath+"/gff_url",schemaPath:"#/$defs/GenomeInfo/properties/gff_url/type",keyword:"type",params:{type: schema46.properties.gff_url.type}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
if(typeof data3 === "string"){
if(!pattern67.test(data3)){
const err10 = {instancePath:instancePath+"/gff_url",schemaPath:"#/$defs/GenomeInfo/properties/gff_url/pattern",keyword:"pattern",params:{pattern: "^(https?|ftp):\\/\\/[^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}/$.?#][^\\n][^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}]*(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
}
if(data.name !== undefined){
let data4 = data.name;
if(typeof data4 === "string"){
if(!pattern15.test(data4)){
const err11 = {instancePath:instancePath+"/name",schemaPath:"#/$defs/GenomeInfo/properties/name/pattern",keyword:"pattern",params:{pattern: "^[A-z-._0-9]+(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
else {
const err12 = {instancePath:instancePath+"/name",schemaPath:"#/$defs/GenomeInfo/properties/name/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
if(data.taxon_id !== undefined){
let data5 = data.taxon_id;
if(Array.isArray(data5)){
const len1 = data5.length;
for(let i1=0; i1<len1; i1++){
let data6 = data5[i1];
if(!(((typeof data6 == "number") && (!(data6 % 1) && !isNaN(data6))) && (isFinite(data6)))){
const err13 = {instancePath:instancePath+"/taxon_id/" + i1,schemaPath:"#/$defs/GenomeInfo/properties/taxon_id/items/type",keyword:"type",params:{type: "integer"}};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if((typeof data6 == "number") && (isFinite(data6))){
if(data6 < 0 || isNaN(data6)){
const err14 = {instancePath:instancePath+"/taxon_id/" + i1,schemaPath:"#/$defs/GenomeInfo/properties/taxon_id/items/minimum",keyword:"minimum",params:{comparison: ">=", limit: 0}};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
}
if(typeof data6 === "string"){
if(!pattern110.test(data6)){
const err15 = {instancePath:instancePath+"/taxon_id/" + i1,schemaPath:"#/$defs/GenomeInfo/properties/taxon_id/items/pattern",keyword:"pattern",params:{pattern: "^[0-9](?=\\n?$)"}};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
}
}
else {
const err16 = {instancePath:instancePath+"/taxon_id",schemaPath:"#/$defs/GenomeInfo/properties/taxon_id/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.url !== undefined){
let data7 = data.url;
if(typeof data7 === "string"){
if(!pattern111.test(data7)){
const err17 = {instancePath:instancePath+"/url",schemaPath:"#/$defs/GenomeInfo/properties/url/pattern",keyword:"pattern",params:{pattern: "^(?:NA|(https?|ftp):\\/\\/[^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}/$.?#][^\\n][^\\u{9}-\\u{d}\\u{1c}-\\u{20}\\u{85}\\u{a0}\\u{1680}\\u{2000}-\\u{200a}\\u{2028}-\\u{2029}\\u{202f}\\u{205f}\\u{3000}]*)(?=\\n?$)"}};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
}
else {
const err18 = {instancePath:instancePath+"/url",schemaPath:"#/$defs/GenomeInfo/properties/url/type",keyword:"type",params:{type: "string"}};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
}
}
else {
const err19 = {instancePath,schemaPath:"#/$defs/GenomeInfo/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err19];
}
else {
vErrors.push(err19);
}
errors++;
}
validate111.errors = vErrors;
return errors === 0;
}
validate111.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate36(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
/*# sourceURL="https://plasmogenepi.github.io/portable-microhaplotype-object" */;
let vErrors = null;
let errors = 0;
const evaluated0 = validate36.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.library_sample_info === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "library_sample_info"}};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.specimen_info === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "specimen_info"}};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.panel_info === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "panel_info"}};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.target_info === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "target_info"}};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.representative_microhaplotypes === undefined){
const err4 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "representative_microhaplotypes"}};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(data.detected_microhaplotypes === undefined){
const err5 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "detected_microhaplotypes"}};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
if(data.pmo_header === undefined){
const err6 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "pmo_header"}};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
if(data.bioinformatics_methods_info !== undefined){
let data0 = data.bioinformatics_methods_info;
if((!(Array.isArray(data0))) && (data0 !== null)){
const err7 = {instancePath:instancePath+"/bioinformatics_methods_info",schemaPath:"#/properties/bioinformatics_methods_info/type",keyword:"type",params:{type: schema13.properties.bioinformatics_methods_info.type}};
if(vErrors === null){
vErrors = [err7];
}
else {
vErrors.push(err7);
}
errors++;
}
if(Array.isArray(data0)){
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
if(!(validate37(data0[i0], {instancePath:instancePath+"/bioinformatics_methods_info/" + i0,parentData:data0,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
errors = vErrors.length;
}
}
}
}
if(data.bioinformatics_run_info !== undefined){
let data2 = data.bioinformatics_run_info;
if((!(Array.isArray(data2))) && (data2 !== null)){
const err8 = {instancePath:instancePath+"/bioinformatics_run_info",schemaPath:"#/properties/bioinformatics_run_info/type",keyword:"type",params:{type: schema13.properties.bioinformatics_run_info.type}};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(Array.isArray(data2)){
const len1 = data2.length;
for(let i1=0; i1<len1; i1++){
if(!(validate41(data2[i1], {instancePath:instancePath+"/bioinformatics_run_info/" + i1,parentData:data2,parentDataProperty:i1,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate41.errors : vErrors.concat(validate41.errors);
errors = vErrors.length;
}
}
}
}
if(data.detected_microhaplotypes !== undefined){
let data4 = data.detected_microhaplotypes;
if(Array.isArray(data4)){
const len2 = data4.length;
for(let i2=0; i2<len2; i2++){
if(!(validate43(data4[i2], {instancePath:instancePath+"/detected_microhaplotypes/" + i2,parentData:data4,parentDataProperty:i2,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate43.errors : vErrors.concat(validate43.errors);
errors = vErrors.length;
}
}
}
else {
const err9 = {instancePath:instancePath+"/detected_microhaplotypes",schemaPath:"#/properties/detected_microhaplotypes/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err9];
}
else {
vErrors.push(err9);
}
errors++;
}
}
if(data.library_sample_info !== undefined){
let data6 = data.library_sample_info;
if(Array.isArray(data6)){
const len3 = data6.length;
for(let i3=0; i3<len3; i3++){
if(!(validate51(data6[i3], {instancePath:instancePath+"/library_sample_info/" + i3,parentData:data6,parentDataProperty:i3,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate51.errors : vErrors.concat(validate51.errors);
errors = vErrors.length;
}
}
}
else {
const err10 = {instancePath:instancePath+"/library_sample_info",schemaPath:"#/properties/library_sample_info/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
}
if(data.panel_info !== undefined){
let data8 = data.panel_info;
if(Array.isArray(data8)){
const len4 = data8.length;
for(let i4=0; i4<len4; i4++){
if(!(validate57(data8[i4], {instancePath:instancePath+"/panel_info/" + i4,parentData:data8,parentDataProperty:i4,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate57.errors : vErrors.concat(validate57.errors);
errors = vErrors.length;
}
}
}
else {
const err11 = {instancePath:instancePath+"/panel_info",schemaPath:"#/properties/panel_info/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err11];
}
else {
vErrors.push(err11);
}
errors++;
}
}
if(data.pmo_header !== undefined){
if(!(validate61(data.pmo_header, {instancePath:instancePath+"/pmo_header",parentData:data,parentDataProperty:"pmo_header",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate61.errors : vErrors.concat(validate61.errors);
errors = vErrors.length;
}
}
if(data.project_info !== undefined){
let data11 = data.project_info;
if((!(Array.isArray(data11))) && (data11 !== null)){
const err12 = {instancePath:instancePath+"/project_info",schemaPath:"#/properties/project_info/type",keyword:"type",params:{type: schema13.properties.project_info.type}};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
if(Array.isArray(data11)){
const len5 = data11.length;
for(let i5=0; i5<len5; i5++){
if(!(validate65(data11[i5], {instancePath:instancePath+"/project_info/" + i5,parentData:data11,parentDataProperty:i5,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate65.errors : vErrors.concat(validate65.errors);
errors = vErrors.length;
}
}
}
}
if(data.read_counts_by_stage !== undefined){
let data13 = data.read_counts_by_stage;
if((!(Array.isArray(data13))) && (data13 !== null)){
const err13 = {instancePath:instancePath+"/read_counts_by_stage",schemaPath:"#/properties/read_counts_by_stage/type",keyword:"type",params:{type: schema13.properties.read_counts_by_stage.type}};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(Array.isArray(data13)){
const len6 = data13.length;
for(let i6=0; i6<len6; i6++){
if(!(validate67(data13[i6], {instancePath:instancePath+"/read_counts_by_stage/" + i6,parentData:data13,parentDataProperty:i6,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate67.errors : vErrors.concat(validate67.errors);
errors = vErrors.length;
}
}
}
}
if(data.representative_microhaplotypes !== undefined){
if(!(validate75(data.representative_microhaplotypes, {instancePath:instancePath+"/representative_microhaplotypes",parentData:data,parentDataProperty:"representative_microhaplotypes",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate75.errors : vErrors.concat(validate75.errors);
errors = vErrors.length;
}
}
if(data.sequencing_info !== undefined){
let data16 = data.sequencing_info;
if((!(Array.isArray(data16))) && (data16 !== null)){
const err14 = {instancePath:instancePath+"/sequencing_info",schemaPath:"#/properties/sequencing_info/type",keyword:"type",params:{type: schema13.properties.sequencing_info.type}};
if(vErrors === null){
vErrors = [err14];
}
else {
vErrors.push(err14);
}
errors++;
}
if(Array.isArray(data16)){
const len7 = data16.length;
for(let i7=0; i7<len7; i7++){
if(!(validate93(data16[i7], {instancePath:instancePath+"/sequencing_info/" + i7,parentData:data16,parentDataProperty:i7,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate93.errors : vErrors.concat(validate93.errors);
errors = vErrors.length;
}
}
}
}
if(data.specimen_info !== undefined){
let data18 = data.specimen_info;
if(Array.isArray(data18)){
const len8 = data18.length;
for(let i8=0; i8<len8; i8++){
if(!(validate95(data18[i8], {instancePath:instancePath+"/specimen_info/" + i8,parentData:data18,parentDataProperty:i8,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate95.errors : vErrors.concat(validate95.errors);
errors = vErrors.length;
}
}
}
else {
const err15 = {instancePath:instancePath+"/specimen_info",schemaPath:"#/properties/specimen_info/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
}
if(data.target_info !== undefined){
let data20 = data.target_info;
if(Array.isArray(data20)){
const len9 = data20.length;
for(let i9=0; i9<len9; i9++){
if(!(validate101(data20[i9], {instancePath:instancePath+"/target_info/" + i9,parentData:data20,parentDataProperty:i9,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate101.errors : vErrors.concat(validate101.errors);
errors = vErrors.length;
}
}
}
else {
const err16 = {instancePath:instancePath+"/target_info",schemaPath:"#/properties/target_info/type",keyword:"type",params:{type: "array"}};
if(vErrors === null){
vErrors = [err16];
}
else {
vErrors.push(err16);
}
errors++;
}
}
if(data.targeted_genomes !== undefined){
let data22 = data.targeted_genomes;
if((!(Array.isArray(data22))) && (data22 !== null)){
const err17 = {instancePath:instancePath+"/targeted_genomes",schemaPath:"#/properties/targeted_genomes/type",keyword:"type",params:{type: schema13.properties.targeted_genomes.type}};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(Array.isArray(data22)){
const len10 = data22.length;
for(let i10=0; i10<len10; i10++){
if(!(validate111(data22[i10], {instancePath:instancePath+"/targeted_genomes/" + i10,parentData:data22,parentDataProperty:i10,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate111.errors : vErrors.concat(validate111.errors);
errors = vErrors.length;
}
}
}
}
}
else {
const err18 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"}};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
validate36.errors = vErrors;
return errors === 0;
}
validate36.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


/** Original (untranslated) schema patterns, keyed by schema path. */
export const patterns: Readonly<Record<string, string>> = {
 "#/$defs/BioMethod/properties/additional_argument/items/pattern": "^[A-z-._0-9{}\\(\\),\\/\\ ]+$",
 "#/$defs/BioMethod/properties/program/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/BioMethod/properties/program_description/pattern": "^[A-z-._0-9\\(\\),\\/\\ ]+$",
 "#/$defs/BioMethod/properties/program_url/pattern": "^[A-z-._0-9\\(\\),\\/\\ ]+$",
 "#/$defs/BioMethod/properties/program_version/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/BioinformaticsRunInfo/properties/bioinformatics_methods_id/pattern": "^[0-9]+$",
 "#/$defs/BioinformaticsRunInfo/properties/bioinformatics_run_name/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/BioinformaticsRunInfo/properties/run_date/pattern": "\\d{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?",
 "#/$defs/DetectedMicrohaplotypes/properties/bioinformatics_run_id/pattern": "^[0-9]+$",
 "#/$defs/DetectedMicrohaplotypesForSample/properties/library_sample_id/pattern": "^[0-9]+$",
 "#/$defs/DetectedMicrohaplotypesForTarget/properties/mhaps_target_id/pattern": "^[0-9]+$",
 "#/$defs/GenomeInfo/properties/chromosomes/items/pattern": "^[A-z-._0-9]+$",
 "#/$defs/GenomeInfo/properties/genome_version/pattern": "^[A-z-._0-9]+$",
 "#/$defs/GenomeInfo/properties/gff_url/pattern": "^(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*$",
 "#/$defs/GenomeInfo/properties/name/pattern": "^[A-z-._0-9]+$",
 "#/$defs/GenomeInfo/properties/taxon_id/items/pattern": "^[0-9]$",
 "#/$defs/GenomeInfo/properties/url/pattern": "^(?:NA|(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*)$",
 "#/$defs/GenomicLocation/properties/alt_seq/pattern": "^[A-z-]+$",
 "#/$defs/GenomicLocation/properties/chrom/pattern": "^[A-z-._0-9]+$",
 "#/$defs/GenomicLocation/properties/end/pattern": "^[0-9]+$",
 "#/$defs/GenomicLocation/properties/genome_id/pattern": "^[0-9]+$",
 "#/$defs/GenomicLocation/properties/ref_seq/pattern": "^[A-z-]+$",
 "#/$defs/GenomicLocation/properties/start/pattern": "^[0-9]+$",
 "#/$defs/GenomicLocation/properties/strand/pattern": "[+-]",
 "#/$defs/LibrarySampleInfo/properties/alternate_identifiers/items/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/LibrarySampleInfo/properties/experiment_accession/pattern": "^[A-z-._0-9]+$",
 "#/$defs/LibrarySampleInfo/properties/fastqs_loc/pattern": "^[A-z-.;,_0-9\\(\\),\\/\\ ]+$",
 "#/$defs/LibrarySampleInfo/properties/library_sample_name/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/LibrarySampleInfo/properties/panel_id/pattern": "^[0-9]+$",
 "#/$defs/LibrarySampleInfo/properties/run_accession/pattern": "^[A-z-._0-9]+$",
 "#/$defs/LibrarySampleInfo/properties/sequencing_info_id/pattern": "^[0-9]+$",
 "#/$defs/LibrarySampleInfo/properties/specimen_id/pattern": "^[0-9]+$",
 "#/$defs/MarkerOfInterest/properties/associations/items/pattern": "^[A-z-._0-9]+$",
 "#/$defs/MaskingInfo/properties/masking_generation_description/pattern": "^[A-z-._0-9\\(\\),\\/\\ ]+$",
 "#/$defs/MicrohaplotypeForTarget/properties/mhap_id/pattern": "^[0-9]+$",
 "#/$defs/PanelInfo/properties/panel_name/pattern": "^[A-z-._0-9]+$",
 "#/$defs/ParasiteDensity/properties/date_measured/pattern": "(?:\\d{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?)?|NA)",
 "#/$defs/ParasiteDensity/properties/density_method_comments/pattern": "^[A-z-._0-9\\(\\),\\/\\ ]+$",
 "#/$defs/ParasiteDensity/properties/parasite_density/pattern": "^[-+]?\\\\d*\\\\.?\\\\d+(?:[eE][-+]?\\\\d+)?$",
 "#/$defs/ParasiteDensity/properties/parasite_density_method/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/PlateInfo/properties/plate_col/pattern": "^[0-9]+$",
 "#/$defs/PlateInfo/properties/plate_name/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/PlateInfo/properties/plate_row/pattern": "^[A-z]$",
 "#/$defs/PmoGenerationMethod/properties/program_name/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/PmoGenerationMethod/properties/program_version/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/PmoHeader/properties/creation_date/pattern": "\\d{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?",
 "#/$defs/PmoHeader/properties/pmo_version/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/PrimerInfo/properties/seq/pattern": "^[A-z]+$",
 "#/$defs/ProjectInfo/properties/BioProject_accession/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/ProjectInfo/properties/project_collector_chief_scientist/pattern": "^[A-z-._0-9;|\\(\\),\\/\\ ]+$",
 "#/$defs/ProjectInfo/properties/project_contributors/items/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/ProjectInfo/properties/project_name/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/ProjectInfo/properties/project_type/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/ProteinVariant/properties/alternative_gene_name/pattern": "^[A-z-._0-9]+$",
 "#/$defs/ProteinVariant/properties/gene_name/pattern": "^[A-z-._0-9:]+$",
 "#/$defs/Pseudocigar/properties/pseudocigar_generation_description/pattern": "^[A-z-._0-9\\(\\),\\/\\ ]+$",
 "#/$defs/Pseudocigar/properties/pseudocigar_seq/pattern": "^[a-zA-Z0-9+=.]+$",
 "#/$defs/ReactionInfo/properties/reaction_name/pattern": "^[A-z-._0-9]+$",
 "#/$defs/ReadCountsByStage/properties/bioinformatics_run_id/pattern": "^[0-9]+$",
 "#/$defs/ReadCountsByStageForLibrarySample/properties/library_sample_id/pattern": "^[0-9]+$",
 "#/$defs/ReadCountsByStageForLibrarySample/properties/total_raw_count/pattern": "^[0-9]+$",
 "#/$defs/ReadCountsByStageForTarget/properties/target_id/pattern": "^[0-9]+$",
 "#/$defs/RepresentativeMicrohaplotype/properties/microhaplotype_name/pattern": "^[A-z-._0-9]+$",
 "#/$defs/RepresentativeMicrohaplotype/properties/quality/pattern": "^[A-z-._0-9]+$",
 "#/$defs/RepresentativeMicrohaplotype/properties/seq/pattern": "^[A-z]+$",
 "#/$defs/RepresentativeMicrohaplotypesForTarget/properties/target_id/pattern": "^[0-9]+$",
 "#/$defs/SequencingInfo/properties/library_kit/pattern": "^[A-z-._0-9\\(\\),\\/\\ ]+$",
 "#/$defs/SequencingInfo/properties/library_layout/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/SequencingInfo/properties/library_screen/pattern": "^[A-z-._0-9\\(\\),\\/\\ ]+$",
 "#/$defs/SequencingInfo/properties/library_selection/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/SequencingInfo/properties/library_source/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/SequencingInfo/properties/library_strategy/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/SequencingInfo/properties/nucl_acid_amp/pattern": "^(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*$",
 "#/$defs/SequencingInfo/properties/nucl_acid_amp_date/pattern": "\\d{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?",
 "#/$defs/SequencingInfo/properties/nucl_acid_ext/pattern": "^(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*$",
 "#/$defs/SequencingInfo/properties/nucl_acid_ext_date/pattern": "\\d{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?",
 "#/$defs/SequencingInfo/properties/pcr_cond/pattern": "^[A-z-._0-9\\(\\),\\/\\ ]+$",
 "#/$defs/SequencingInfo/properties/seq_center/pattern": "^[A-z-._0-9\\(\\),\\/\\ ]+$",
 "#/$defs/SequencingInfo/properties/seq_date/pattern": "\\d{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?",
 "#/$defs/SequencingInfo/properties/seq_instrument_model/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/SequencingInfo/properties/seq_platform/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/SequencingInfo/properties/sequencing_info_name/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/SpecimenInfo/properties/alternate_identifiers/items/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/SpecimenInfo/properties/collection_country/pattern": "^[\\w ,._:'–-]+$",
 "#/$defs/SpecimenInfo/properties/collection_date/pattern": "(?:\\d{4}(?:-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?)?|NA)",
 "#/$defs/SpecimenInfo/properties/drug_usage/items/pattern": "^[A-z-._0-9;|\\(\\),\\/\\ ]+$",
 "#/$defs/SpecimenInfo/properties/env_broad_scale/pattern": "^[A-z-._0-9;|\\(\\),\\/\\ ]+$",
 "#/$defs/SpecimenInfo/properties/env_local_scale/pattern": "^[A-z-._0-9;|\\(\\),\\/\\ ]+$",
 "#/$defs/SpecimenInfo/properties/env_medium/pattern": "^[A-z-._0-9;|\\(\\),\\/\\ ]+$",
 "#/$defs/SpecimenInfo/properties/gravidity/pattern": "^[0-9]+$",
 "#/$defs/SpecimenInfo/properties/host_age/pattern": "^\\d*\\.?\\d+$",
 "#/$defs/SpecimenInfo/properties/host_sex/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/SpecimenInfo/properties/host_taxon_id/pattern": "^[0-9]+$",
 "#/$defs/SpecimenInfo/properties/lat_lon/pattern": "^[-+]?\\d{1,2}(?:\\.\\d+)?,[-+]?\\d{1,3}(?:\\.\\d+)?$",
 "#/$defs/SpecimenInfo/properties/project_id/pattern": "^[0-9]+$",
 "#/$defs/SpecimenInfo/properties/specimen_accession/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/SpecimenInfo/properties/specimen_collect_device/pattern": "^[A-z-._0-9\\(\\),\\/\\ ]+$",
 "#/$defs/SpecimenInfo/properties/specimen_comments/items/pattern": "^[A-z-._0-9\\(\\),\\/\\ ]+$",
 "#/$defs/SpecimenInfo/properties/specimen_name/pattern": "^[A-z-._0-9\\(\\),\\/\\ ]+$",
 "#/$defs/SpecimenInfo/properties/specimen_store_loc/pattern": "^[A-z-._0-9\\(\\),\\/\\ ]+$",
 "#/$defs/SpecimenInfo/properties/specimen_taxon_id/items/pattern": "^[0-9]+$",
 "#/$defs/SpecimenInfo/properties/specimen_type/pattern": "^[A-z-._0-9\\(\\),\\/\\ ]+$",
 "#/$defs/SpecimenInfo/properties/treatment_status/items/pattern": "^[A-z-._0-9;|\\(\\),\\/\\ ]+$",
 "#/$defs/StageReadCounts/properties/stage/pattern": "^[A-z-._0-9 ]+$",
 "#/$defs/TargetInfo/properties/gene_name/pattern": "^[A-z-._0-9:]+$",
 "#/$defs/TargetInfo/properties/target_name/pattern": "^[A-z-._0-9]+$",
 "#/$defs/TravelInfo/properties/lat_lon/pattern": "^[-+]?\\d{1,2}(?:\\.\\d+)?,[-+]?\\d{1,3}(?:\\.\\d+)?$",
 "#/$defs/TravelInfo/properties/travel_country/pattern": "^[\\w ,._:'–-]+$",
 "#/$defs/TravelInfo/properties/travel_end_date/pattern": "\\d{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?",
 "#/$defs/TravelInfo/properties/travel_start_date/pattern": "\\d{4}-(?:0[1-9]|1[0-2])(?:-(?:0[1-9]|[12][0-9]|3[01]))?"
};
